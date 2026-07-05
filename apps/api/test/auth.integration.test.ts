import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { sql } from "drizzle-orm";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { authMeSchema } from "@forgeos/types";

import { createDb, type Db } from "../src/db/client.js";
import { runMigrations } from "../src/db/migrate.js";
import { buildServer } from "../src/server.js";
import { SESSION_COOKIE } from "../src/plugins/auth.js";
import { authCookie, seedRoleUser, TEST_PASSWORD } from "./helpers.js";

/** Integration suite — requires TEST_DATABASE_URL (see the sync suite). */
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;

describe.skipIf(!TEST_DATABASE_URL)("auth & RBAC (integration, Phase 2.5)", () => {
  let db: Db;
  let close: () => Promise<void>;
  let app: Awaited<ReturnType<typeof buildServer>>;
  let docsDir: string;

  beforeAll(async () => {
    await runMigrations(TEST_DATABASE_URL as string);
    ({ db, close } = createDb(TEST_DATABASE_URL as string));
  });

  afterAll(async () => {
    await close();
  });

  beforeEach(async () => {
    await db.execute(sql`TRUNCATE users, sessions CASCADE`);
    // Empty docs dir: sync runs fast in the RBAC checks below.
    docsDir = join(await mkdtemp(join(tmpdir(), "forgeos-auth-")), "docs");
    app = await buildServer({ db, config: { docsDir } });
  });

  afterEach(async () => {
    await app.close();
    await rm(join(docsDir, ".."), { recursive: true, force: true });
  });

  // ── Auth flow ────────────────────────────────────────────────────

  it("logs in with valid credentials, sets an httpOnly cookie, /me works", async () => {
    const email = await seedRoleUser(db, "viewer");

    const login = await app.inject({
      method: "POST",
      url: "/api/v1/auth/login",
      payload: { email, password: TEST_PASSWORD }
    });
    expect(login.statusCode).toBe(200);
    const { user } = authMeSchema.parse(login.json());
    expect(user.email).toBe(email);
    expect(user.role).toBe("viewer");
    expect(JSON.stringify(login.json())).not.toContain("password");

    const setCookie = String(login.headers["set-cookie"]);
    expect(setCookie).toContain(`${SESSION_COOKIE}=`);
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=Lax");

    const cookie = setCookie.split(";")[0] as string;
    const me = await app.inject({ method: "GET", url: "/api/v1/auth/me", headers: { cookie } });
    expect(me.statusCode).toBe(200);
    expect(authMeSchema.parse(me.json()).user.email).toBe(email);
  });

  it("rejects wrong password and unknown email with the same 401", async () => {
    const email = await seedRoleUser(db, "viewer");

    const wrongPassword = await app.inject({
      method: "POST",
      url: "/api/v1/auth/login",
      payload: { email, password: "nope" }
    });
    const unknownEmail = await app.inject({
      method: "POST",
      url: "/api/v1/auth/login",
      payload: { email: "ghost@test.local", password: "nope" }
    });
    expect(wrongPassword.statusCode).toBe(401);
    expect(unknownEmail.statusCode).toBe(401);
    expect(wrongPassword.json()).toEqual(unknownEmail.json());
  });

  it("logout destroys the session server-side", async () => {
    const cookie = await authCookie(app, db, "viewer");

    const logout = await app.inject({ method: "POST", url: "/api/v1/auth/logout", headers: { cookie } });
    expect(logout.statusCode).toBe(204);

    // Same cookie no longer works — the session row is gone, not just the cookie.
    const me = await app.inject({ method: "GET", url: "/api/v1/auth/me", headers: { cookie } });
    expect(me.statusCode).toBe(401);
  });

  it("rejects tampered and missing session tokens", async () => {
    const anonymous = await app.inject({ method: "GET", url: "/api/v1/auth/me" });
    expect(anonymous.statusCode).toBe(401);

    const forged = await app.inject({
      method: "GET",
      url: "/api/v1/auth/me",
      headers: { cookie: `${SESSION_COOKIE}=forged-token-value` }
    });
    expect(forged.statusCode).toBe(401);
  });

  it("validates the login body", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/auth/login",
      payload: { email: "not-an-email" }
    });
    expect(res.statusCode).toBe(400);
  });

  // ── RBAC on protected routes ─────────────────────────────────────

  it("documents require authentication (401 anonymous)", async () => {
    expect((await app.inject({ method: "GET", url: "/api/v1/documents" })).statusCode).toBe(401);
    expect((await app.inject({ method: "GET", url: "/api/v1/documents/std-001" })).statusCode).toBe(401);
  });

  it("viewer and editor can read documents but cannot run sync", async () => {
    for (const role of ["viewer", "editor"] as const) {
      const cookie = await authCookie(app, db, role);
      const docs = await app.inject({ method: "GET", url: "/api/v1/documents", headers: { cookie } });
      expect(docs.statusCode, role).toBe(200);

      const sync = await app.inject({ method: "POST", url: "/api/v1/sync/run", headers: { cookie } });
      expect(sync.statusCode, role).toBe(403);
      const runs = await app.inject({ method: "GET", url: "/api/v1/sync/runs", headers: { cookie } });
      expect(runs.statusCode, role).toBe(403);
    }
  });

  it("admin can read documents and run sync", async () => {
    const cookie = await authCookie(app, db, "admin");

    const docs = await app.inject({ method: "GET", url: "/api/v1/documents", headers: { cookie } });
    expect(docs.statusCode).toBe(200);

    const sync = await app.inject({ method: "POST", url: "/api/v1/sync/run", headers: { cookie } });
    expect(sync.statusCode).toBe(201);
    const runs = await app.inject({ method: "GET", url: "/api/v1/sync/runs", headers: { cookie } });
    expect(runs.statusCode).toBe(200);
  });

  it("health stays public (docker healthcheck)", async () => {
    expect((await app.inject({ method: "GET", url: "/api/v1/health" })).statusCode).toBe(200);
  });

  it("deactivated users cannot log in and lose existing sessions", async () => {
    const cookie = await authCookie(app, db, "viewer");
    await db.execute(sql`UPDATE users SET is_active = false WHERE email = 'viewer@test.local'`);

    const me = await app.inject({ method: "GET", url: "/api/v1/auth/me", headers: { cookie } });
    expect(me.statusCode).toBe(401);

    const login = await app.inject({
      method: "POST",
      url: "/api/v1/auth/login",
      payload: { email: "viewer@test.local", password: TEST_PASSWORD }
    });
    expect(login.statusCode).toBe(401);
  });
});
