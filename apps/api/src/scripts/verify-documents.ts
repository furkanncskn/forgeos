/**
 * One-shot end-to-end check of the documents read API against the real
 * database: `pnpm --filter @forgeos/api exec tsx src/scripts/verify-documents.ts`
 */
import { documentDetailSchema, documentListSchema } from "@forgeos/types";

import { ensureUser } from "../modules/auth/service.js";
import { buildServer } from "../server.js";

const app = await buildServer();

/** Reads require a session now — seed a viewer and log in first. */
async function loginCookie(): Promise<string> {
  await ensureUser(app.db, {
    email: "verify@forgeos.local",
    name: "Verify Script",
    password: "verify-password",
    role: "viewer"
  });
  const res = await app.inject({
    method: "POST",
    url: "/api/v1/auth/login",
    payload: { email: "verify@forgeos.local", password: "verify-password" }
  });
  if (res.statusCode !== 200) throw new Error(`login failed: ${res.body}`);
  const setCookie = res.headers["set-cookie"];
  const first = Array.isArray(setCookie) ? setCookie[0] : setCookie;
  return (first as string).split(";")[0] as string;
}

try {
  const anonymous = await app.inject({ method: "GET", url: "/api/v1/documents" });
  console.log(`anonymous list → HTTP ${anonymous.statusCode} (expect 401)`);

  const cookie = await loginCookie();
  const headers = { cookie };
  console.log("logged in as viewer");

  const list = documentListSchema.parse(
    (await app.inject({ method: "GET", url: "/api/v1/documents?limit=5", headers })).json()
  );
  console.log(`list: total=${list.total}, first page: ${list.documents.map((d) => d.docId).join(", ")}`);

  const typed = documentListSchema.parse(
    (await app.inject({ method: "GET", url: "/api/v1/documents?type=decision", headers })).json()
  );
  console.log(`type=decision: total=${typed.total} → ${typed.documents.map((d) => d.docId).join(", ")}`);

  const search = documentListSchema.parse(
    (await app.inject({ method: "GET", url: "/api/v1/documents?q=ADR-00", headers })).json()
  );
  console.log(`q=ADR-00: ${search.documents.map((d) => `${d.docId} (${d.title})`).join("; ")}`);

  const byTitle = documentListSchema.parse(
    (await app.inject({ method: "GET", url: "/api/v1/documents?q=governance&type=agent", headers })).json()
  );
  console.log(`q=governance&type=agent: ${byTitle.documents.map((d) => d.docId).join(", ")}`);

  const detail = documentDetailSchema.parse(
    (await app.inject({ method: "GET", url: "/api/v1/documents/adr-0002", headers })).json()
  );
  console.log(
    `detail adr-0002: '${detail.title}' status=${detail.status} body=${detail.bodyMd.length} chars, ` +
      `outgoing=${detail.outgoing.length} (${detail.outgoing
        .map((l) => `${l.targetRef}${l.target ? "" : "!"}`)
        .join(", ")}), incoming=${detail.incoming.length}`
  );

  const missing = await app.inject({ method: "GET", url: "/api/v1/documents/nope-000", headers });
  console.log(`unknown slug → HTTP ${missing.statusCode}`);
} finally {
  await app.close();
}
