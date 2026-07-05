import { z } from "zod";

/**
 * @forgeos/types — shared contracts between the ForgeOS API and Web UI.
 *
 * Every API request/response shape lives here as a Zod schema, so the API
 * validates against the exact same contract the UI consumes (ADR-0001, §2).
 */

// Frontmatter contracts: DOC_TYPES, per-type schemas, validateFrontmatter().
export * from "./frontmatter.js";

// Sync contracts: sync run shapes for POST /sync/run and GET /sync/runs.
export * from "./sync.js";

// Documents contracts: list/detail shapes for the read-only Document Explorer.
export * from "./documents.js";

// Auth contracts: roles, session user, login shapes for the auth module.
export * from "./auth.js";

// Search contracts: query/response shapes for GET /search and related docs.
export * from "./search.js";

/** Payload returned by `GET /api/v1/health`. */
export const healthStatusSchema = z.object({
  status: z.literal("ok"),
  service: z.string(),
  version: z.string(),
  uptimeSeconds: z.number(),
  timestamp: z.string()
});
export type HealthStatus = z.infer<typeof healthStatusSchema>;

/** Standard API error envelope (Fastify default shape). */
export const apiErrorSchema = z.object({
  statusCode: z.number(),
  error: z.string(),
  message: z.string()
});
export type ApiError = z.infer<typeof apiErrorSchema>;
