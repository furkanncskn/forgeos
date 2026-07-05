/**
 * One-shot end-to-end check of Knowledge Search against the real corpus:
 *   pnpm --filter @forgeos/api exec tsx src/scripts/verify-search.ts
 */
import { relatedResponseSchema, searchResponseSchema } from "@forgeos/types";

import { ensureUser } from "../modules/auth/service.js";
import { buildServer } from "../server.js";

const app = await buildServer();

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

const failures: string[] = [];
function check(label: string, ok: boolean) {
  console.log(`${ok ? "✓" : "✗"} ${label}`);
  if (!ok) failures.push(label);
}

try {
  const anonymous = await app.inject({ method: "GET", url: "/api/v1/search?q=x" });
  check(`anonymous search → 401 (got ${anonymous.statusCode})`, anonymous.statusCode === 401);

  const headers = { cookie: await loginCookie() };
  const search = async (qs: string) =>
    searchResponseSchema.parse(
      (await app.inject({ method: "GET", url: `/api/v1/search?${qs}`, headers })).json()
    );

  const dialect = await search("q=frontmatter%20dialect");
  const dialectTop3 = dialect.results.slice(0, 3).map((r) => r.document.docId);
  console.log(
    `  q="frontmatter dialect": total=${dialect.total}, took=${dialect.query.tookMs}ms, top3=${dialectTop3.join(", ")}`
  );
  check("ADR-0002 in top 3 for 'frontmatter dialect'", dialectTop3.includes("ADR-0002"));

  const pinned = await search("q=ADR-0002");
  check(
    `exact-id query pins ADR-0002 to #1 (got ${pinned.results[0]?.document.docId})`,
    pinned.results[0]?.document.docId === "ADR-0002"
  );

  const governance = await search("q=agent%20governance");
  console.log(
    `  q="agent governance": total=${governance.total}, took=${governance.query.tookMs}ms, #1=${governance.results[0]?.document.docId}`
  );
  check("agent governance finds AGENT-001 in top 3",
    governance.results.slice(0, 3).some((r) => r.document.docId === "AGENT-001"));

  const filtered = await search("q=governance&type=decision&type=standard");
  check(
    "type facet filter restricts results",
    filtered.results.every((r) => ["decision", "standard"].includes(r.document.docType))
  );
  check("facets returned", filtered.facets.types.length > 0 && filtered.facets.statuses.length > 0);

  const hybrid = await search("q=governance&mode=hybrid");
  check(`mode=hybrid negotiates to keyword (got ${hybrid.query.modeUsed})`, hybrid.query.modeUsed === "keyword");

  const snippetOk = dialect.results[0]?.snippet.some((s) => s.highlight);
  check("top result has highlighted snippet spans", snippetOk === true);

  const relatedRes = await app.inject({
    method: "GET",
    url: "/api/v1/documents/adr-0002/related",
    headers
  });
  const related = relatedResponseSchema.parse(relatedRes.json());
  const relatedIds = related.related.map((r) => `${r.document.docId}(${r.reasons.join("+")})`);
  console.log(`  related(adr-0002): ${relatedIds.join(", ")}`);
  check(
    "ADR-0001 related to ADR-0002 via link",
    related.related.some((r) => r.document.docId === "ADR-0001" && r.reasons.includes("link"))
  );

  const agentsOnly = relatedResponseSchema.parse(
    (
      await app.inject({
        method: "GET",
        url: "/api/v1/documents/std-001/related?types=agent&limit=5",
        headers
      })
    ).json()
  );
  check(
    "related?types=agent returns only agents",
    agentsOnly.related.every((r) => r.document.docType === "agent")
  );

  // Latency snapshot over a few repeated queries (warm cache).
  const timings: number[] = [];
  for (let i = 0; i < 5; i++) {
    timings.push((await search("q=enterprise%20architecture")).query.tookMs);
  }
  console.log(`  latency 'enterprise architecture' ×5: [${timings.join(", ")}] ms`);

  console.log(failures.length === 0 ? "\nALL CHECKS PASSED" : `\n${failures.length} CHECKS FAILED`);
  process.exitCode = failures.length === 0 ? 0 : 1;
} finally {
  await app.close();
}
