import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/* A password and a signed cookie, no dependency and no user table: there is one
   admin and the thing being protected is a list of form submissions.

   The signing key is derived from the password itself, which means there is no
   second secret to set and changing the password invalidates every existing
   session. That is the behaviour you want from a password change anyway. */

export const ADMIN_COOKIE = "go_admin";
const SESSION_DAYS = 7;

export function adminPassword(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 8) return null;
  return password;
}

export function isConfigured(): boolean {
  return adminPassword() !== null;
}

function signingKey(password: string): Buffer {
  return createHash("sha256").update(`go-admin-session:${password}`).digest();
}

/* Digest both sides first so the comparison is over equal-length buffers and
   does not leak the password length through an early return. */
export function passwordMatches(candidate: string): boolean {
  const actual = adminPassword();
  if (!actual) return false;

  const a = createHash("sha256").update(candidate).digest();
  const b = createHash("sha256").update(actual).digest();
  return timingSafeEqual(a, b);
}

export function createSessionToken(): string {
  const password = adminPassword();
  if (!password) throw new Error("No admin password configured");

  const expiry = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const signature = createHmac("sha256", signingKey(password))
    .update(String(expiry))
    .digest("hex");
  return `${expiry}.${signature}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  const password = adminPassword();
  if (!password || !token) return false;

  const [expiryPart, signature] = token.split(".");
  const expiry = Number(expiryPart);
  if (!expiryPart || !signature || !Number.isFinite(expiry)) return false;
  if (expiry < Date.now()) return false;

  const expected = createHmac("sha256", signingKey(password))
    .update(expiryPart)
    .digest("hex");

  const given = Buffer.from(signature, "hex");
  const want = Buffer.from(expected, "hex");
  if (given.length !== want.length) return false;
  return timingSafeEqual(given, want);
}

export const SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60;
