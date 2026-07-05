import type { FastifyPluginAsync } from "fastify";

import { relatedQuerySchema, searchQuerySchema } from "@forgeos/types";

import { getRelatedDocuments } from "./related.js";
import { searchDocuments } from "./service.js";

/** Knowledge Search endpoints (ADR-0003). Reads require viewer+. */
export const searchRoutes: FastifyPluginAsync = async (app) => {
  const viewer = app.requireRole("viewer");

  /** Full-text search with facets, snippets and mode negotiation. */
  app.get("/search", { preHandler: viewer }, async (req, reply) => {
    const parsed = searchQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return reply.code(400).send({
        statusCode: 400,
        error: "Bad Request",
        message: parsed.error.issues
          .map((issue) => `${issue.path.join(".") || "query"}: ${issue.message}`)
          .join("; ")
      });
    }
    return searchDocuments(app.db, parsed.data);
  });

  /** Related documents for one document, filterable by type. */
  app.get<{ Params: { slug: string } }>(
    "/documents/:slug/related",
    { preHandler: viewer },
    async (req, reply) => {
      const parsed = relatedQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return reply.code(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: parsed.error.issues
            .map((issue) => `${issue.path.join(".") || "query"}: ${issue.message}`)
            .join("; ")
        });
      }
      const result = await getRelatedDocuments(app.db, req.params.slug, parsed.data);
      if (!result) {
        return reply.code(404).send({
          statusCode: 404,
          error: "Not Found",
          message: `no document with slug '${req.params.slug}'`
        });
      }
      return result;
    }
  );
};
