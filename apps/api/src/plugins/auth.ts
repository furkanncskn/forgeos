import cookie from "@fastify/cookie";
import type { FastifyReply, FastifyRequest, preHandlerHookHandler } from "fastify";
import fp from "fastify-plugin";

import { roleAtLeast, type SessionUser, type UserRole } from "@forgeos/types";

import { validateSession } from "../modules/auth/service.js";

/** Session cookie: httpOnly bearer token, 30-day sliding expiry. */
export const SESSION_COOKIE = "forgeos_session";

declare module "fastify" {
  interface FastifyRequest {
    /** Set by requireRole / tryAuthenticate; null when anonymous. */
    user: SessionUser | null;
    /** Raw session token from the cookie (for logout). */
    sessionToken: string | null;
  }
  interface FastifyInstance {
    /** preHandler guard: 401 without a valid session, 403 below `minRole`. */
    requireRole: (minRole: UserRole) => preHandlerHookHandler;
    /** Resolves the session if present; never rejects the request. */
    tryAuthenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    setSessionCookie: (reply: FastifyReply, token: string, expiresAt: Date) => void;
    clearSessionCookie: (reply: FastifyReply) => void;
  }
}

/**
 * Cookie-session auth plugin (ADR-0001 §4 — auth module exports the RBAC
 * middleware used by all other modules).
 */
export const authPlugin = fp(async (app) => {
  await app.register(cookie);

  const secure = process.env.NODE_ENV === "production";
  const cookieOptions = { httpOnly: true, sameSite: "lax" as const, path: "/", secure };

  app.decorateRequest("user", null);
  app.decorateRequest("sessionToken", null);

  app.decorate("setSessionCookie", (reply: FastifyReply, token: string, expiresAt: Date) => {
    reply.setCookie(SESSION_COOKIE, token, { ...cookieOptions, expires: expiresAt });
  });

  app.decorate("clearSessionCookie", (reply: FastifyReply) => {
    reply.clearCookie(SESSION_COOKIE, cookieOptions);
  });

  app.decorate("tryAuthenticate", async (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.cookies[SESSION_COOKIE];
    if (!token) return;
    const result = await validateSession(app.db, token);
    if (!result) return;
    req.user = result.user;
    req.sessionToken = token;
    if (result.renewedExpiresAt) {
      app.setSessionCookie(reply, token, result.renewedExpiresAt);
    }
  });

  app.decorate("requireRole", (minRole: UserRole): preHandlerHookHandler => {
    return async function guard(req, reply) {
      await app.tryAuthenticate(req, reply);
      if (!req.user) {
        return reply.code(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "authentication required"
        });
      }
      if (!roleAtLeast(req.user.role, minRole)) {
        return reply.code(403).send({
          statusCode: 403,
          error: "Forbidden",
          message: `requires the '${minRole}' role`
        });
      }
    };
  });
});
