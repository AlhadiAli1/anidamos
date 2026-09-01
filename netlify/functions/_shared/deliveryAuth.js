import crypto from "node:crypto";

const DELIVERY_TOKEN_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

function getDeliverySecret() {
  return process.env.DELIVERY_SESSION_SECRET || "";
}

function sign(value) {
  return crypto.createHmac("sha256", getDeliverySecret()).update(value).digest("base64url");
}

function base64UrlEncode(value) {
  return Buffer.from(value).toString("base64url");
}

function base64UrlDecode(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

// role: "manager" or "delivery". For delivery, include the agent id + phone so
// the API knows which agent is acting and resolves WhatsApp numbers.
export function createDeliverySessionToken({ role, agentId, phone }) {
  const payload = base64UrlEncode(
    JSON.stringify({
      sub: role,
      aid: agentId || null,
      ph: phone ? String(phone).replace(/\D/g, "") : null,
      exp: Date.now() + DELIVERY_TOKEN_TTL_MS,
    })
  );
  return `${payload}.${sign(payload)}`;
}

export function verifyDeliverySessionToken(token) {
  if (!token || !getDeliverySecret()) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  const expectedSignature = sign(payload || "");
  if (!payload || !signature || signature.length !== expectedSignature.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) return null;
  try {
    const data = JSON.parse(base64UrlDecode(payload));
    if (!["manager", "delivery"].includes(data.sub)) return null;
    if (Number(data.exp) < Date.now()) return null;
    return {
      role: data.sub,
      agentId: data.aid || null,
      phone: data.ph || null,
    };
  } catch {
    return null;
  }
}

export function getTokenFromRequest(event) {
  const authHeader = event.headers?.authorization || "";
  return authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
}

export function managerConfigReady() {
  return Boolean(getDeliverySecret() && process.env.DELIVERY_MANAGER_PASSWORD);
}

export function verifyManagerPassword(password) {
  return String(password || "") === process.env.DELIVERY_MANAGER_PASSWORD;
}
