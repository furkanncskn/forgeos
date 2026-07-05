import { describe, expect, it } from "vitest";

import { hashPassword, verifyPassword } from "../src/lib/password.js";

describe("password hashing (scrypt)", () => {
  it("verifies a correct password and rejects a wrong one", async () => {
    const hash = await hashPassword("s3cret-Passw0rd");
    expect(await verifyPassword("s3cret-Passw0rd", hash)).toBe(true);
    expect(await verifyPassword("s3cret-Passw0rd!", hash)).toBe(false);
    expect(await verifyPassword("", hash)).toBe(false);
  });

  it("salts every hash (same password → different hashes)", async () => {
    const a = await hashPassword("same-password");
    const b = await hashPassword("same-password");
    expect(a).not.toBe(b);
    expect(await verifyPassword("same-password", a)).toBe(true);
    expect(await verifyPassword("same-password", b)).toBe(true);
  });

  it("embeds its parameters and never stores the plaintext", async () => {
    const hash = await hashPassword("hunter2");
    expect(hash.startsWith("scrypt$131072$8$1$")).toBe(true);
    expect(hash).not.toContain("hunter2");
  });

  it("rejects malformed stored hashes instead of throwing", async () => {
    expect(await verifyPassword("x", "")).toBe(false);
    expect(await verifyPassword("x", "bcrypt$whatever")).toBe(false);
    expect(await verifyPassword("x", "scrypt$not$numbers$here$AA$BB")).toBe(false);
  });

  it("treats unicode normalization forms as the same password", async () => {
    // é as one codepoint vs. e + combining accent
    const hash = await hashPassword("café");
    expect(await verifyPassword("café", hash)).toBe(true);
  });
});
