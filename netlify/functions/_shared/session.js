import crypto from "node:crypto";

export const SESSION_COOKIE = "andiamos_session";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function getSessionSecret() {
  return process.env.SESSION_SECRET || "andiamos-local-session-secret-change-me";
}

function shouldUseSecureCookies() {
  return process.env.CONTEXT === "production" || process.env.NODE_ENV === "production";
}

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(value) {
  return Buffer.from(value.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
}

export function createSessionToken(user) {
  const payload = {
    sub: String(user.id),
    username: user.username,
    exp: Date.now() + SESSION_TTL_MS,
  };

  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(`${header}.${body}`)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `${header}.${body}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [header, body, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(`${header}.${body}`)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  if (crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature))) {
    try {
      const payload = JSON.parse(base64UrlDecode(body));
      if (!payload || Number(payload.exp) < Date.now()) return null;
      return payload;
    } catch {
      return null;
    }
  }

  return null;
}

export function getSessionFromRequest(event) {
  const cookieHeader = event.headers?.cookie || "";
  const cookies = cookieHeader.split(";").map((part) => part.trim());
  const match = cookies.find((entry) => entry.startsWith(`${SESSION_COOKIE}=`));

  if (!match) return null;
  const rawToken = decodeURIComponent(match.slice(SESSION_COOKIE.length + 1));
  return verifySessionToken(rawToken);
}

export function getCookieOptions() {
  const secure = shouldUseSecureCookies() ? "; Secure" : "";
  return `Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${secure}`;
}

export function buildSessionCookie(user) {
  return `${SESSION_COOKIE}=${createSessionToken(user)}; ${getCookieOptions()}`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${
    shouldUseSecureCookies() ? "; Secure" : ""
  }`;
}
