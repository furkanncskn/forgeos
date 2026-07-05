/**
 * CLI sync: `pnpm --filter @forgeos/api sync`
 * Runs migrations, then one full /docs → PostgreSQL sync, and prints the summary.
 */
import { loadConfig } from "../config.js";
import { createDb } from "../db/client.js";
import { runMigrations } from "../db/migrate.js";
import { runDocsSync } from "../modules/sync/service.js";

const config = loadConfig();
const { db, close } = createDb(config.databaseUrl);

try {
  await runMigrations(config.databaseUrl);
  const summary = await runDocsSync(db, config.docsDir);
  console.log(`Sync ${summary.status}: ${summary.filesSeen} seen, ${summary.filesChanged} changed, ` +
    `${summary.filesUnchanged} unchanged, ${summary.filesInvalid} invalid.`);
  for (const err of summary.errors) {
    console.error(`  ✗ ${err.path}`);
    for (const issue of err.issues) {
      console.error(`      ${issue.path ? `${issue.path}: ` : ""}${issue.message}`);
    }
  }
  process.exitCode = summary.errors.length > 0 ? 1 : 0;
} finally {
  await close();
}
