import type { FastifyPluginAsync } from "fastify";

import { listSyncRuns, runDocsSync } from "./service.js";

/** Sync endpoints are admin-only (ADR-0001 §4 — sync). */
export const syncRoutes: FastifyPluginAsync = async (app) => {
  const admin = app.requireRole("admin");

  /**
   * Runs a full /docs → PostgreSQL sync synchronously and returns the run
   * summary. (Moves to a pg-boss background job when runs get large.)
   */
  app.post("/sync/run", { preHandler: admin }, async (_req, reply) => {
    const summary = await runDocsSync(app.db, app.config.docsDir);
    return reply.code(201).send(summary);
  });

  /** Lists the most recent sync runs, newest first. */
  app.get("/sync/runs", { preHandler: admin }, async () => {
    return { runs: await listSyncRuns(app.db) };
  });
};
