import { json, withNetlifyResponse } from "./_shared/response.js";
import { getTokenFromRequest, verifyDeliverySessionToken } from "./_shared/deliveryAuth.js";
import { getSupabaseAdmin } from "./_shared/supabase.js";

const DELIVERY_FIELDS =
  "id, title, details, price, customer_phone, agent_id, address, delivery_fee, status, manager_note, created_at, accepted_at, delivered_at";
const RESTAURANT_TIME_ZONE = "Asia/Beirut";
export const DELIVERY_AREAS = Object.freeze({
  Baraachit: 150000,
  Safad: 150000,
  Tebnin: 200000,
  Haris: 350000,
  Majdal: 250000,
  Jmayjme: 200000,
  Shakra: 200000,
  Sultaneye: 250000,
  "Bir salesel": 350000,
  "Ayta Jabal": 300000,
  Sawene: 350000,
  Kherbe: 300000,
  Abrikha: 350000,
});

function withDeliveryFee(delivery) {
  return { ...delivery, delivery_fee: Number(delivery.delivery_fee) || DELIVERY_AREAS[delivery.address] || 0 };
}

export function businessDayKey(value) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: RESTAURANT_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(value)).reduce((result, part) => ({ ...result, [part.type]: part.value }), {});
  const date = new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day)));
  if (Number(parts.hour) < 10) date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

async function nextOrderTitle(supabase) {
  const { data, error } = await supabase
    .from("deliveries")
    .select("title, created_at")
    .order("created_at", { ascending: false })
    .limit(1000);
  if (error) throw new Error("Unable to generate an order number.");

  const currentDay = businessDayKey(new Date());
  const highest = (data || []).reduce((current, delivery) => {
    const match = /^Order (\d+)$/.exec(delivery.title || "");
    return businessDayKey(delivery.created_at) === currentDay && match
      ? Math.max(current, Number(match[1]))
      : current;
  }, 0);
  return `Order ${highest + 1}`;
}

async function handler(event) {
  const session = verifyDeliverySessionToken(getTokenFromRequest(event));
  if (!session) return json({ error: "Not signed in." }, 401);

  const supabase = getSupabaseAdmin();
  const method = event.httpMethod;

  // ---------- GET : list deliveries ----------
  if (method === "GET") {
    // Manager: everything. Agent: only their own assigned deliveries.
    const query = supabase.from("deliveries").select(DELIVERY_FIELDS);
    if (session.role === "delivery") {
      query.eq("agent_id", session.agentId);
    }
    const { data, error } = await query
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      return json({
        error: error.message?.includes("does not exist")
          ? "Run the deliveries table migration in Supabase first."
          : `Unable to load deliveries: ${error.message || "unknown database error"}`,
      }, 500);
    }

    // Attach agent info (name + phone) for the manager view.
    let agents = [];
    if (session.role === "manager" && (data || []).length) {
      const ids = [...new Set(data.map((d) => d.agent_id))];
      const { data: agentRows } = ids.length
        ? await supabase.from("agents").select("id, name, username, phone").in("id", ids)
        : { data: [] };
      agents = agentRows || [];
    }
    const agentMap = new Map(agents.map((a) => [a.id, a]));

    const currentDay = businessDayKey(new Date());
    const deliveries = (data || []).filter((d) => businessDayKey(d.created_at) === currentDay).map((d) => ({
      ...withDeliveryFee(d),
      agent: session.role === "manager" ? agentMap.get(d.agent_id) || null : null,
    }));

    return json({ ok: true, deliveries });
  }

  const body = event.body ? JSON.parse(event.body) : {};

  // ---------- POST : manager creates a delivery ----------
  if (method === "POST") {
    if (session.role !== "manager") return json({ error: "Only the manager can create deliveries." }, 403);

    const title = String(body.title || "").trim() || await nextOrderTitle(supabase);
    const price = String(body.price || "").trim();
    const selectedArea = String(body.address || "").trim();
    const customAddress = String(body.custom_address || "").trim();
    const customFee = Number(body.delivery_fee);
    const isCustomArea = selectedArea === "custom";
    const address = isCustomArea ? customAddress : selectedArea;
    const deliveryFee = isCustomArea ? customFee : DELIVERY_AREAS[address];

    if (!price) return json({ error: "Order price is required." }, 400);
    if (isCustomArea && (!customAddress || customAddress.length > 80 || !Number.isInteger(customFee) || customFee <= 0)) {
      return json({ error: "Enter a custom area name and a valid whole-number fee in LL." }, 400);
    }
    if (!deliveryFee) return json({ error: "Select a valid delivery area." }, 400);

    // Resolve the assigned agent's phone server-side from their account.
    if (!body.agentId) return json({ error: "Assign a delivery agent." }, 400);
    const { data: agent, error: agentError } = await supabase
      .from("agents")
      .select("id, phone, is_active")
      .eq("id", body.agentId)
      .maybeSingle();
    if (agentError || !agent) return json({ error: "Delivery agent not found." }, 400);
    if (!agent.is_active) return json({ error: "That delivery agent is not active." }, 400);

    const record = {
      title,
      details: String(body.details || "").trim(),
      price,
      customer_phone: String(body.customer_phone || body.customerPhone || "").replace(/\D/g, ""),
      agent_id: agent.id,
      address,
      delivery_fee: deliveryFee,
      manager_note: String(body.manager_note || body.managerNote || "").trim(),
      status: "pending",
    };

    const { data, error } = await supabase.from("deliveries").insert(record).select(DELIVERY_FIELDS).single();
    if (error || !data) return json({ error: "Unable to create delivery." }, 500);

    return json({ ok: true, delivery: { ...withDeliveryFee(data), agent: { id: agent.id, phone: agent.phone } } }, 201);
  }

  // ---------- PATCH : update status ----------
  if (method === "PATCH") {
    const id = String(body.id || "").trim();
    const action = String(body.action || "").trim();

    if (!id) return json({ error: "Delivery id is required." }, 400);

    const { data: current, error: fetchError } = await supabase
      .from("deliveries")
      .select("id, status, agent_id")
      .eq("id", id)
      .maybeSingle();
    if (fetchError || !current) return json({ error: "Delivery not found." }, 404);

    let nextStatus = null;
    let extra = {};

    if (action === "cancel") {
      if (session.role !== "manager") return json({ error: "Only the manager can cancel." }, 403);
      if (current.status === "delivered") return json({ error: "Delivered orders cannot be cancelled." }, 400);
      nextStatus = "cancelled";
    } else if (action === "accept") {
      if (session.role !== "delivery") return json({ error: "Only a delivery agent can accept." }, 403);
      if (current.agent_id !== session.agentId) return json({ error: "This delivery is not assigned to you." }, 403);
      if (current.status !== "pending") return json({ error: "This delivery was already handled." }, 400);
      nextStatus = "accepted";
      extra.accepted_at = new Date().toISOString();
    } else if (action === "delivered") {
      if (session.role !== "delivery") return json({ error: "Only a delivery agent can complete." }, 403);
      if (current.agent_id !== session.agentId) return json({ error: "This delivery is not assigned to you." }, 403);
      if (current.status !== "accepted") return json({ error: "You must accept the delivery first." }, 400);
      nextStatus = "delivered";
      extra.delivered_at = new Date().toISOString();
    } else {
      return json({ error: "Unknown action." }, 400);
    }

    const { data: updated, error: updateError } = await supabase
      .from("deliveries")
      .update({ status: nextStatus, ...extra })
      .eq("id", id)
      .select(DELIVERY_FIELDS)
      .single();
    if (updateError || !updated) return json({ error: "Unable to update delivery." }, 500);
    return json({ ok: true, delivery: withDeliveryFee(updated) });
  }

  return json({ error: "Method not allowed." }, 405);
}

export default withNetlifyResponse(handler);
