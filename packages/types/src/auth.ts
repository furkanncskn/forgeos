import { z } from "zod";

/**
 * Shared contracts for authentication & RBAC (ADR-0001 §1 — auth, §4 — auth
 * module). Session-based: the API sets an httpOnly cookie on login; the UI
 * never sees the token.
 */

/** Roles, weakest to strongest. Each role implies everything below it. */
export const USER_ROLES = ["viewer", "editor", "admin"] as const;
export const userRoleSchema = z.enum(USER_ROLES);
export type UserRole = z.infer<typeof userRoleSchema>;

/** True when `role` grants at least `required` (viewer < editor < admin). */
export function roleAtLeast(role: UserRole, required: UserRole): boolean {
  return USER_ROLES.indexOf(role) >= USER_ROLES.indexOf(required);
}

/** The authenticated user as exposed to the UI — never includes the hash. */
export const sessionUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  role: userRoleSchema
});
export type SessionUser = z.infer<typeof sessionUserSchema>;

export const loginRequestSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(512)
});
export type LoginRequest = z.infer<typeof loginRequestSchema>;

/** Payload of POST /auth/login and GET /auth/me. */
export const authMeSchema = z.object({
  user: sessionUserSchema
});
export type AuthMe = z.infer<typeof authMeSchema>;
