import { json, withNetlifyResponse } from "./_shared/response.js";
import { getSupabaseAdmin } from "./_shared/supabase.js";

const TRACKING_FIELDS = "id, title, price, status, created_at, accepted_at, delivered_at";

async function handler(event) {
  if (event.httpMethod !== "GET") return json({ error: "Method not allowed." }, 405);

  const trackingId = new URLSearchParams((event.path || "").split("?")[1] || "").get("id") || "";
  if (!trackingId) return json({ error: "Tracking link is invalid." }, 400);

  const { data, error } = await getSupabaseAdmin()
    .from("deliveries")
    .select(TRACKING_FIELDS)
    .eq("id", trackingId)
    .maybeSingle();

  if (error || !data) return json({ error: "Delivery not found." }, 404);
  return json({ ok: true, delivery: data });
}

export default withNetlifyResponse(handler);