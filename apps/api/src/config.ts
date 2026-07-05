import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// This file lives at apps/api/src/config.ts (dev, via tsx) or
// apps/api/dist/config.js (build) — both are one level below the app root.
const moduleDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(moduleDir, "..");

/** Monorepo root (two levels above apps/api). */
export const repoRoot = resolve(appRoot, "..", "..");

export interface ApiConfig {
  port: number;
  host: string;
  databaseUrl: string;
  /** Absolute path of the canonical /docs folder to sync from. */
  docsDir: string;
  /** Absolute path of the SQL migrations folder. */
  migrationsDir: string;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ApiConfig {
  return {
    port: Number(env.PORT ?? 3001),
    host: env.HOST ?? "0.0.0.0",
    databaseUrl: env.DATABASE_URL ?? "postgresql://forgeos:forgeos@localhost:5432/forgeos",
    docsDir: env.DOCS_DIR ? resolve(env.DOCS_DIR) : resolve(repoRoot, "docs"),
    migrationsDir: resolve(appRoot, "drizzle")
  };
}
