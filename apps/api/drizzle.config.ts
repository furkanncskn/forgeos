import { defineConfig } from "drizzle-kit";

/**
 * drizzle-kit config — used for `pnpm db:generate` (diff src/db/schema.ts into
 * a new SQL file under ./drizzle) and `pnpm db:studio`. Migrations are applied
 * by the runner in src/db/migrate.ts (`pnpm db:migrate`).
 */
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://forgeos:forgeos@localhost:5432/forgeos"
  }
});
