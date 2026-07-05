import { describe, expect, it } from "vitest";
import { healthStatusSchema } from "@forgeos/types";

import { buildServer } from "../src/server.js";

describe("GET /api/v1/health", () => {
  it("returns 200 with a payload matching the shared contract", async () => {
    const app = await buildServer();

    const res = await app.inject({ method: "GET", url: "/api/v1/health" });

    expect(res.statusCode).toBe(200);

    // Validate against the shared Zod schema — the same contract the UI uses.
    const body = healthStatusSchema.parse(res.json());
    expect(body.status).toBe("ok");
    expect(body.service).toBe("forgeos-api");
    expect(body.uptimeSeconds).toBeGreaterThanOrEqual(0);

    await app.close();
  });

  it("returns 404 for unknown routes", async () => {
    const app = await buildServer();

    const res = await app.inject({ method: "GET", url: "/api/v1/does-not-exist" });

    expect(res.statusCode).toBe(404);
    await app.close();
  });
});
