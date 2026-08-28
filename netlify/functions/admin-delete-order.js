import { getSupabaseAdmin } from "./_shared/supabase.js";
import { isAdminRequest } from "./_shared/adminSession.js";
import { withNetlifyResponse } from "./_shared/response.js";

async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed." }) };
  }
  if (!isAdminRequest(event)) {
    return { statusCode: 403, body: JSON.stringify({ error: "Administrator access required." }) };
  }

  try {
    const { orderId } = JSON.parse(event.body || "{}");
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("orders")
      .delete()
      .eq("id", Number(orderId))
      .eq("payment_status", "pending_whatsapp")
      .select("id")
      .single();

    if (error || !data) {
      return { statusCode: 404, body: JSON.stringify({ error: "Only pending, unconfirmed orders can be deleted." }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true, orderId: data.id }) };
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid order deletion." }) };
  }
}

export default withNetlifyResponse(handler);
