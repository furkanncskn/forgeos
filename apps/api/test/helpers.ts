import type { FastifyInstance } from "fastify";

import type { UserRole } from "@forgeos/types";

import type { Db } from "../src/db/client.js";
import { ensureUser } from "../src/modules/auth/service.js";

export const TEST_PASSWORD = "correct horse battery staple";

/** Creates (or reuses) a `<role>@test.local` user and returns its email. */
export async function seedRoleUser(db: Db, role: UserRole): Promise<string> {
  const email = `${role}@test.local`;
  await ensureUser(db, { email, name: `Test ${role}`, password: TEST_PASSWORD, role });
  return email;
}

/**
 * Seeds a user with `role`, logs in through the real endpoint and returns the
 * Cookie header value for authenticated app.inject calls.
 */
export async function authCookie(app: FastifyInstance, db: Db, role: UserRole): Promise<string> {
  const email = await seedRoleUser(db, role);
  const res = await app.inject({
    method: "POST",
    url: "/api/v1/auth/login",
    payload: { email, password: TEST_PASSWORD }
  });
  if (res.statusCode !== 200) {
    throw new Error(`test login failed for ${role}: HTTP ${res.statusCode} ${res.body}`);
  }
  const setCookie = res.headers["set-cookie"];
  const first = Array.isArray(setCookie) ? setCookie[0] : setCookie;
  if (!first) throw new Error("login response did not set a session cookie");
  return first.split(";")[0] as string;
}
