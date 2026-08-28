import crypto from "node:crypto";
import bcrypt from "bcryptjs";

export const ADMIN_SESSION_COOKIE = "andiamos_admin_session";
const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 8;

function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD_HASH || "";
}

function shouldUseSecureCookie() {
  return process.env.CONTEXT === "production" || process.env.NODE_ENV === "production";
}

function encode(value) {
  return Buffer.from(value).toString("base64url");
}

function sign(value) {
  return crypto.createHmac("sha256", getAdminSessionSecret()).update(value).digest("base64url");
}

export function adminConfigurationReady() {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD_HASH && getAdminSessionSecret());
}

export async function validateAdminCredentials(username, password) {
  if (!adminConfigurationReady()) return false;
  if (String(username || "") !== process.env.ADMIN_USERNAME) return false;
  return bcrypt.compare(String(password || ""), process.env.ADMIN_PASSWORD_HASH);
}

export function buildAdminSessionCookie() {
  const payload = encode(JSON.stringify({ sub: "admin", exp: Date.now() + ADMIN_SESSION_TTL_MS }));
  const token = `${payload}.${sign(payload)}`;
  const secure = shouldUseSecureCookie() ? "; Secure" : "";
  return `${ADMIN_SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800${secure}`;
}

export function clearAdminSessionCookie() {
  const secure = shouldUseSecureCookie() ? "; Secure" : "";
  return `${ADMIN_SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
}

export function isAdminRequest(event) {
  const cookieHeader = event.headers?.cookie || "";
  const entry = cookieHeader.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${ADMIN_SESSION_COOKIE}=`));
  if (!entry || !getAdminSessionSecret()) return false;

  const token = decodeURIComponent(entry.slice(ADMIN_SESSION_COOKIE.length + 1));
  const [payload, signature] = token.split(".");
  const expectedSignature = sign(payload || "");
  if (!payload || !signature || signature.length !== expectedSignature.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return data.sub === "admin" && Number(data.exp) > Date.now();
  } catch {
    return false;
  }
}
