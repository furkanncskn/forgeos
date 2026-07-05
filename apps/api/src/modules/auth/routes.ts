import type { FastifyPluginAsync } from "fastify";

import { loginRequestSchema } from "@forgeos/types";

import { login, logout } from "./service.js";

/** POST /auth/login · POST /auth/logout · GET /auth/me (ADR-0001 §4). */
export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post("/auth/login", async (req, reply) => {
    const parsed = loginRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.code(400).send({
        statusCode: 400,
        error: "Bad Request",
        message: "email and password are required"
      });
    }

    const result = await login(app.db, parsed.data.email, parsed.data.password);
    if (!result) {
      // One message for wrong password / unknown user / deactivated account.
      return reply.code(401).send({
        statusCode: 401,
        error: "Unauthorized",
        message: "invalid email or password"
      });
    }

    app.setSessionCookie(reply, result.token, result.expiresAt);
    return reply.code(200).send({ user: result.user });
  });

  app.post("/auth/logout", async (req, reply) => {
    await app.tryAuthenticate(req, reply);
    if (req.sessionToken) {
      await logout(app.db, req.sessionToken);
    }
    app.clearSessionCookie(reply);
    return reply.code(204).send();
  });

  app.get("/auth/me", { preHandler: app.requireRole("viewer") }, async (req) => {
    return { user: req.user };
  });
};
