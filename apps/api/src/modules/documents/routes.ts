import type { FastifyPluginAsync } from "fastify";

import { documentListQuerySchema } from "@forgeos/types";

import { getDocumentBySlug, listDocuments } from "./service.js";

/**
 * Read-only Document Explorer endpoints (ADR-0001 §4 — documents).
 * All reads require an authenticated session (viewer role or above).
 */
export const documentsRoutes: FastifyPluginAsync = async (app) => {
  const viewer = app.requireRole("viewer");

  /** Lists documents: ?type= filters by category, ?q= searches title and id. */
  app.get("/documents", { preHandler: viewer }, async (req, reply) => {
    const parsed = documentListQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return reply.code(400).send({
        statusCode: 400,
        error: "Bad Request",
        message: parsed.error.issues
          .map((issue) => `${issue.path.join(".") || "query"}: ${issue.message}`)
          .join("; ")
      });
    }
    return listDocuments(app.db, parsed.data);
  });

  /** Loads one document (metadata, body, relationships) by slug or id. */
  app.get<{ Params: { slug: string } }>("/documents/:slug", { preHandler: viewer }, async (req, reply) => {
    const document = await getDocumentBySlug(app.db, req.params.slug);
    if (!document) {
      return reply.code(404).send({
        statusCode: 404,
        error: "Not Found",
        message: `no document with slug '${req.params.slug}'`
      });
    }
    return document;
  });
};
