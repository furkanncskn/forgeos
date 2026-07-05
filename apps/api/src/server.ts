import cors from "@fastify/cors";
import Fastify, { type FastifyInstance } from "fastify";

import { loadConfig, type ApiConfig } from "./config.js";
import { createDb, type Db } from "./db/client.js";
import { authRoutes } from "./modules/auth/routes.js";
import { documentsRoutes } from "./modules/documents/routes.js";
import { searchRoutes } from "./modules/search/routes.js";
import { syncRoutes } from "./modules/sync/routes.js";
import { authPlugin } from "./plugins/auth.js";
import { healthRoutes } from "./routes/health.js";

declare module "fastify" {
  interface FastifyInstance {
    db: Db;
    config: ApiConfig;
  }
}

export interface BuildServerOptions {
  /** Inject a database handle (tests); when omitted one is created from config. */
  db?: Db;
  /** Override parts of the loaded config (tests). */
  config?: Partial<ApiConfig>;
}

/**
 * Builds the Fastify instance without binding a port,
 * so tests can exercise routes via `app.inject()`.
 */
export async function buildServer(options: BuildServerOptions = {}): Promise<FastifyInstance> {
  const config: ApiConfig = { ...loadConfig(), ...options.config };

  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? "info"
    }
  });

  app.decorate("config", config);

  if (options.db) {
    app.decorate("db", options.db);
  } else {
    // postgres.js connects lazily — the health endpoint stays DB-independent.
    const { db, close } = createDb(config.databaseUrl);
    app.decorate("db", db);
    app.addHook("onClose", async () => {
      await close();
    });
  }

  // Cookie sessions require a same-site or explicitly trusted origin.
  await app.register(cors, { origin: true, credentials: true });
  await app.register(authPlugin);

  // All feature modules mount under the versioned prefix (ADR-0001, §4).
  await app.register(healthRoutes, { prefix: "/api/v1" });
  await app.register(authRoutes, { prefix: "/api/v1" });
  await app.register(syncRoutes, { prefix: "/api/v1" });
  await app.register(documentsRoutes, { prefix: "/api/v1" });
  await app.register(searchRoutes, { prefix: "/api/v1" });

  return app;
}
