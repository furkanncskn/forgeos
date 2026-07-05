import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";
import { promisify } from "node:util";

// promisify() picks the 3-arg overload; scrypt with options needs the 4-arg one.
const scryptAsync = promisify(scrypt) as (
  password: string | Buffer,
  salt: Buffer,
  keylen: number,
  options: ScryptOptions
) => Promise<Buffer>;

/**
 * Password hashing with Node's built-in scrypt (OWASP-recommended params:
 * N=2^17, r=8, p=1) — no native dependencies. Format:
 *   scrypt$N$r$p$<salt b64>$<hash b64>
 * Parameters are stored per-hash so they can be raised later without
 * invalidating existing credentials.
 */

const SCRYPT_N = 131072; // 2^17
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

async function deriveKey(
  password: string,
  salt: Buffer,
  N: number,
  r: number,
  p: number
): Promise<Buffer> {
  return scryptAsync(password.normalize("NFC"), salt, KEY_LENGTH, {
    N,
    r,
    p,
    maxmem: 256 * N * r // default maxmem is too small for N=2^17
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const key = await deriveKey(password, salt, SCRYPT_N, SCRYPT_R, SCRYPT_P);
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt.toString("base64")}$${key.toString("base64")}`;
}

/** Constant-time verification. Returns false for malformed stored hashes. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const N = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  if (!Number.isInteger(N) || !Number.isInteger(r) || !Number.isInteger(p)) return false;
  const salt = Buffer.from(parts[4] as string, "base64");
  const expected = Buffer.from(parts[5] as string, "base64");
  if (salt.length === 0 || expected.length !== KEY_LENGTH) return false;
  const actual = await deriveKey(password, salt, N, r, p);
  return timingSafeEqual(actual, expected);
}

/**
 * A real hash of an unguessable random password, verified against when the
 * email is unknown — login latency stays identical for unknown vs. known
 * users, preventing account enumeration by timing.
 */
export const DUMMY_HASH_PROMISE: Promise<string> = hashPassword(randomBytes(32).toString("hex"));
