/**
 * Admin session auth — simple shared password + signed cookie.
 *
 * Uses the Web Crypto API (HMAC-SHA256) so the same code runs in both the
 * Edge middleware and Node server actions. No DB lookup needed to verify.
 *
 * Required env (in .env.local, never committed):
 *   ADMIN_PASSWORD        — the login password
 *   ADMIN_SESSION_SECRET  — HMAC signing key for the session cookie
 */

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days (seconds)

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error("ADMIN_SESSION_SECRET is not set");
  return s;
}

async function hmacHex(payload: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Constant-time string comparison. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

/** Build a signed session token: `<expiryMs>.<hmac>`. */
export async function createSessionToken(): Promise<string> {
  const expiry = String(Date.now() + SESSION_MAX_AGE * 1000);
  const sig = await hmacHex(expiry, getSecret());
  return `${expiry}.${sig}`;
}

/** Verify a session token's signature and expiry. */
export async function verifySessionToken(
  token: string | undefined | null,
): Promise<boolean> {
  if (!token) return false;
  const dot = token.lastIndexOf(".");
  if (dot < 1) return false;
  const expiry = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = await hmacHex(expiry, getSecret());
  if (!timingSafeEqual(sig, expected)) return false;
  const expiryMs = Number(expiry);
  if (!Number.isFinite(expiryMs) || Date.now() > expiryMs) return false;
  return true;
}

/** Compare a submitted password against ADMIN_PASSWORD (constant-time). */
export function verifyPassword(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  return timingSafeEqual(input, pw);
}
