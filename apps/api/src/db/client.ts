import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema.js";

export type Db = PostgresJsDatabase<typeof schema>;

export interface DbHandle {
  db: Db;
  /** Closes the underlying connection pool. */
  close: () => Promise<void>;
}

/**
 * Creates a Drizzle database handle. postgres.js connects lazily, so this is
 * safe to call at startup even when PostgreSQL is not running yet — the
 * connection is only opened on the first query.
 */
export function createDb(databaseUrl: string): DbHandle {
  const client = postgres(databaseUrl, { onnotice: () => {} });
  return {
    db: drizzle(client, { schema }),
    close: () => client.end()
  };
}
