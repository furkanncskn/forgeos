import type { FastifyPluginAsync } from "fastify";
import type { HealthStatus } from "@forgeos/types";

const SERVICE_NAME = "forgeos-api";
const SERVICE_VERSION = "0.1.0";
const startedAt = Date.now();

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get("/health", async (): Promise<HealthStatus> => {
    return {
      status: "ok",
      service: SERVICE_NAME,
      version: SERVICE_VERSION,
      uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
      timestamp: new Date().toISOString()
    };
  });
};
