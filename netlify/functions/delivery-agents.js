import bcrypt from "bcryptjs";
import { json, withNetlifyResponse } from "./_shared/response.js";
import { getTokenFromRequest, verifyDeliverySessionToken } from "./_shared/deliveryAuth.js";
import { getSupabaseAdmin } from "./_shared/supabase.js";

function normalizePhone(value) {
  let digits = String(value || "").replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0") && !digits.startsWith("00")) digits = digits.slice(1);
  return digits;
}

async function handler(event) {
  const session = verifyDeliverySessionToken(getTokenFromRequest(event));
  if (!session) return json({ error: "Not signed in." }, 401);
  if (session.role !== "manager") return json({ error: "Only the manager can manage agents." }, 403);

  const supabase = getSupabaseAdmin();
  const method = event.httpMethod;

  // ---------- GET : list agents ----------
  if (method === "GET") {
    const { data, error } = await supabase
      .from("agents")
      .select("id, name, username, phone, is_active, created_at")
      .order("name", { ascending: true });
    if (error) return json({ error: "Unable to load agents." }, 500);
    return json({ ok: true, agents: data || [] });
  }

  const body = event.body ? JSON.parse(event.body) : {};

  // ---------- POST : create agent ----------
  if (method === "POST") {
    const name = String(body.name || "").trim();
    const username = String(body.username || "").trim().toLowerCase();
    const password = String(body.password || "");
    const phone = normalizePhone(body.phone);

    if (!name) return json({ error: "Agent name is required." }, 400);
    if (!/^[a-z0-9._-]{3,24}$/.test(username)) return json({ error: "Username must be 3-24 letters/numbers/dots/dashes." }, 400);
    if (password.length < 4) return json({ error: "Password must be at least 4 characters." }, 400);
    if (phone.length < 6) return json({ error: "A valid phone number is required." }, 400);

    const passwordHash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("agents")
      .insert({ name, username, password_hash: passwordHash, phone })
      .select("id, name, username, phone, is_active")
      .single();
    if (error) {
      const message = error.code === "23505"
        ? "That username is already taken."
        : `Unable to create agent: ${error.message || "unknown database error"}`;
      return json({ error: message }, 400);
    }

    return json({ ok: true, agent: data }, 201);
  }

  // ---------- PATCH : update agent (name, phone, password, active) ----------
  if (method === "PATCH") {
    const id = String(body.id || "").trim();
    if (!id) return json({ error: "Agent id is required." }, 400);

    const patch = {};
    if (body.name !== undefined) {
      const name = String(body.name).trim();
      if (!name) return json({ error: "Agent name is required." }, 400);
      patch.name = name;
    }
    if (body.phone !== undefined) {
      const phone = normalizePhone(body.phone);
      if (phone.length < 6) return json({ error: "A valid phone number is required." }, 400);
      patch.phone = phone;
    }
    if (body.password) {
      if (String(body.password).length < 4) return json({ error: "Password must be at least 4 characters." }, 400);
      patch.password_hash = await bcrypt.hash(String(body.password), 10);
    }
    if (body.is_active !== undefined) patch.is_active = Boolean(body.is_active);

    if (!Object.keys(patch).length) return json({ error: "Nothing to update." }, 400);

    const { data, error } = await supabase
      .from("agents")
      .update(patch)
      .eq("id", id)
      .select("id, name, username, phone, is_active")
      .single();
    if (error) return json({ error: "Unable to update agent." }, 400);
    return json({ ok: true, agent: data });
  }

  // ---------- DELETE : remove agent ----------
  if (method === "DELETE") {
    const path = event.path || "";
    const qs = new URLSearchParams((path.split("?")[1]) || "");
    const id = qs.get("id") || "";
    if (!id) return json({ error: "Agent id is required." }, 400);
    const { data: assigned } = await supabase
      .from("deliveries")
      .select("id")
      .eq("agent_id", id)
      .eq("status", "pending");
    if ((assigned || []).length) {
      return json({ error: "This agent still has pending deliveries assigned." }, 400);
    }
    const { error } = await supabase.from("agents").delete().eq("id", id);
    if (error) return json({ error: "Unable to delete agent." }, 400);
    return json({ ok: true });
  }

  return json({ error: "Method not allowed." }, 405);
}

export default withNetlifyResponse(handler);
