import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import postgres from "postgres";

import { loadConfig } from "../config.js";

/**
 * Minimal, transparent migration runner.
 *
 * Executes every `*.sql` file in apps/api/drizzle/ in filename order, each in
 * its own transaction, recording applied files in `_migrations` so re-runs
 * are no-ops. Future schema changes are new numbered SQL files (0001_…,
 * 0002_…) generated with `pnpm db:generate` (drizzle-kit) or written by hand
 * to match src/db/schema.ts.
 */
export async function runMigrations(databaseUrl: string, migrationsDir?: string): Promise<string[]> {
  const dir = migrationsDir ?? loadConfig().migrationsDir;
  const sql = postgres(databaseUrl, { max: 1, onnotice: () => {} });
  const applied: string[] = [];
  try {
    await sql`CREATE TABLE IF NOT EXISTS _migrations (
      name text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )`;
    const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();
    for (const file of files) {
      const done = await sql`SELECT 1 FROM _migrations WHERE name = ${file}`;
      if (done.length > 0) continue;
      const ddl = await readFile(join(dir, file), "utf8");
      await sql.begin(async (tx) => {
        await tx.unsafe(ddl);
        await tx`INSERT INTO _migrations (name) VALUES (${file})`;
      });
      applied.push(file);
    }
    return applied;
  } finally {
    await sql.end();
  }
}

// CLI entry: `pnpm --filter @forgeos/api db:migrate`
const isMain =
  process.argv[1] !== undefined &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const config = loadConfig();
  runMigrations(config.databaseUrl)
    .then((applied) => {
      console.log(
        applied.length > 0
          ? `Applied ${applied.length} migration(s): ${applied.join(", ")}`
          : "Database is up to date."
      );
    })
    .catch((err) => {
      console.error("Migration failed:", err);
      process.exit(1);
    });
}
