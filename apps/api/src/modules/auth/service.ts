import { createHash, randomBytes } from "node:crypto";

import { and, eq, lt } from "drizzle-orm";

import type { SessionUser, UserRole } from "@forgeos/types";
import { userRoleSchema } from "@forgeos/types";

import type { Db } from "../../db/client.js";
import { sessions, users } from "../../db/schema.js";
import { DUMMY_HASH_PROMISE, hashPassword, verifyPassword } from "../../lib/password.js";

/** Sessions live 30 days; validation extends them when under half remains. */
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** The cookie carries the raw token; the DB stores only its SHA-256. */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function toSessionUser(row: typeof users.$inferSelect): SessionUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: userRoleSchema.parse(row.role)
  };
}

export interface LoginResult {
  user: SessionUser;
  /** Raw session token for the cookie. Never stored server-side. */
  token: string;
  expiresAt: Date;
}

/**
 * Verifies credentials and creates a session. Always burns a password hash
 * verification, even for unknown emails, so response timing does not reveal
 * whether an account exists.
 */
export async function login(db: Db, email: string, password: string): Promise<LoginResult | undefined> {
  const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
  const user = rows[0];

  if (!user || !user.isActive) {
    await verifyPassword(password, await DUMMY_HASH_PROMISE);
    return undefined;
  }
  if (!(await verifyPassword(password, user.passwordHash))) {
    return undefined;
  }

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(sessions).values({ id: hashToken(token), userId: user.id, expiresAt });
  return { user: toSessionUser(user), token, expiresAt };
}

export interface ValidatedSession {
  user: SessionUser;
  /** Set when the sliding expiry was extended — re-issue the cookie. */
  renewedExpiresAt?: Date;
}

/** Resolves a cookie token to its user; expired sessions are deleted lazily. */
export async function validateSession(db: Db, token: string): Promise<ValidatedSession | undefined> {
  const id = hashToken(token);
  const rows = await db
    .select({ session: sessions, user: users })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) return undefined;

  if (row.session.expiresAt.getTime() <= Date.now() || !row.user.isActive) {
    await db.delete(sessions).where(eq(sessions.id, id));
    return undefined;
  }

  let renewedExpiresAt: Date | undefined;
  if (row.session.expiresAt.getTime() - Date.now() < SESSION_TTL_MS / 2) {
    renewedExpiresAt = new Date(Date.now() + SESSION_TTL_MS);
    await db.update(sessions).set({ expiresAt: renewedExpiresAt }).where(eq(sessions.id, id));
  }

  return { user: toSessionUser(row.user), renewedExpiresAt };
}

export async function logout(db: Db, token: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
}

/** Housekeeping: removes expired sessions (called opportunistically). */
export async function deleteExpiredSessions(db: Db): Promise<void> {
  await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
}

export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
  role: UserRole;
}

/** Creates a user (idempotent by email — returns the existing user if present). */
export async function ensureUser(db: Db, input: CreateUserInput): Promise<SessionUser> {
  const email = input.email.trim().toLowerCase();
  const existing = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email)))
    .limit(1);
  if (existing[0]) return toSessionUser(existing[0]);

  const passwordHash = await hashPassword(input.password);
  const inserted = await db
    .insert(users)
    .values({ email, name: input.name, passwordHash, role: input.role })
    .onConflictDoNothing({ target: users.email })
    .returning();
  if (inserted[0]) return toSessionUser(inserted[0]);

  // Lost a concurrent insert race — the row exists now.
  const winner = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!winner[0]) throw new Error(`failed to create user ${email}`);
  return toSessionUser(winner[0]);
}
