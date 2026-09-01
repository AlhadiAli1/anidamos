import bcrypt from "bcryptjs";
import { json, withNetlifyResponse } from "./_shared/response.js";
import { getSupabaseAdmin } from "./_shared/supabase.js";
import {
  createDeliverySessionToken,
  managerConfigReady,
  verifyManagerPassword,
} from "./_shared/deliveryAuth.js";

async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  const role = JSON.parse(event.body || "{}").role;

  if (role === "manager") {
    if (!managerConfigReady()) {
      return json({ error: "Manager login is not configured on the server." }, 500);
    }
    const body = JSON.parse(event.body || "{}");
    if (!verifyManagerPassword(body.password)) {
      return json({ error: "Incorrect password." }, 401);
    }
    return json({ ok: true, role, token: createDeliverySessionToken({ role }) });
  }

  if (role === "delivery") {
    const body = JSON.parse(event.body || "{}");
    const username = String(body.username || "").trim();
    const password = String(body.password || "");
    if (!username || !password) {
      return json({ error: "Username and password are required." }, 400);
    }

    const supabase = getSupabaseAdmin();
    const { data: agent, error } = await supabase
      .from("agents")
      .select("id, username, password_hash, phone, is_active")
      .eq("username", username)
      .maybeSingle();

    if (error) {
      return json({ error: "Agent accounts are not configured yet." }, 500);
    }
    if (!agent || !agent.is_active) {
      return json({ error: "No delivery agent found with that username." }, 401);
    }
    const valid = await bcrypt.compare(password, agent.password_hash);
    if (!valid) {
      return json({ error: "Incorrect password." }, 401);
    }

    return json({
      ok: true,
      role,
      token: createDeliverySessionToken({ role, agentId: agent.id, phone: agent.phone }),
    });
  }

  return json({ error: "Invalid role." }, 400);
}

export default withNetlifyResponse(handler);
