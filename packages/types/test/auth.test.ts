import { describe, expect, it } from "vitest";

import { loginRequestSchema, roleAtLeast, sessionUserSchema, userRoleSchema } from "../src/index.js";

describe("RBAC role hierarchy", () => {
  it("admin ≥ editor ≥ viewer", () => {
    expect(roleAtLeast("admin", "viewer")).toBe(true);
    expect(roleAtLeast("admin", "editor")).toBe(true);
    expect(roleAtLeast("admin", "admin")).toBe(true);
    expect(roleAtLeast("editor", "viewer")).toBe(true);
    expect(roleAtLeast("editor", "editor")).toBe(true);
    expect(roleAtLeast("editor", "admin")).toBe(false);
    expect(roleAtLeast("viewer", "viewer")).toBe(true);
    expect(roleAtLeast("viewer", "editor")).toBe(false);
    expect(roleAtLeast("viewer", "admin")).toBe(false);
  });

  it("rejects unknown roles at the boundary", () => {
    expect(userRoleSchema.safeParse("superadmin").success).toBe(false);
  });
});

describe("auth contracts", () => {
  it("normalizes login emails (trim + lowercase)", () => {
    const parsed = loginRequestSchema.parse({ email: "  Admin@ForgeOS.local ", password: "x" });
    expect(parsed.email).toBe("admin@forgeos.local");
  });

  it("rejects empty passwords and invalid emails", () => {
    expect(loginRequestSchema.safeParse({ email: "not-an-email", password: "x" }).success).toBe(false);
    expect(loginRequestSchema.safeParse({ email: "a@b.co", password: "" }).success).toBe(false);
  });

  it("session user never carries a password field", () => {
    const user = sessionUserSchema.parse({
      id: "6f1e0d9a-3f75-4a6c-9d0e-1c2b3a4d5e6f",
      email: "a@b.co",
      name: "A",
      role: "viewer",
      passwordHash: "should-be-stripped"
    });
    expect("passwordHash" in user).toBe(false);
  });
});
