/**
 * Seeds the local-development admin user (idempotent):
 *   pnpm --filter @forgeos/api seed
 *
 * Credentials come from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD / SEED_ADMIN_NAME,
 * with dev-only defaults. Change or disable for anything internet-facing.
 */
import { loadConfig } from "../config.js";
import { createDb } from "../db/client.js";
import { runMigrations } from "../db/migrate.js";
import { ensureUser } from "../modules/auth/service.js";

const email = process.env.SEED_ADMIN_EMAIL ?? "admin@forgeos.local";
const password = process.env.SEED_ADMIN_PASSWORD ?? "forgeos-admin";
const name = process.env.SEED_ADMIN_NAME ?? "Local Admin";

const config = loadConfig();
const { db, close } = createDb(config.databaseUrl);

try {
  await runMigrations(config.databaseUrl);
  const user = await ensureUser(db, { email, name, password, role: "admin" });
  console.log(`Admin ready: ${user.email} (role: ${user.role})`);
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.log(`Password: ${password}  ← dev default, change via SEED_ADMIN_PASSWORD`);
  }
} finally {
  await close();
}
