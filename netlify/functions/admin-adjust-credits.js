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
    const body = JSON.parse(event.body || "{}");
    const customerId = Number(body.customerId);
    const amount = Number(body.amount);
    if (!Number.isInteger(customerId) || !Number.isFinite(amount) || amount === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "Enter a valid customer and non-zero amount." }) };
    }

    const supabase = getSupabaseAdmin();
    const { data: customer, error: lookupError } = await supabase
      .from("customers")
      .select("points_balance")
      .eq("id", customerId)
      .single();
    if (lookupError || !customer) {
      return { statusCode: 404, body: JSON.stringify({ error: "Customer not found." }) };
    }

    const newBalance = Number((Number(customer.points_balance || 0) + amount).toFixed(2));
    if (newBalance < 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "Credit balance cannot be negative." }) };
    }

    const { data: updated, error: updateError } = await supabase
      .from("customers")
      .update({ points_balance: newBalance })
      .eq("id", customerId)
      .select("id, username, points_balance")
      .single();
    if (updateError || !updated) {
      return { statusCode: 500, body: JSON.stringify({ error: "Unable to update credits." }) };
    }

    return { statusCode: 200, body: JSON.stringify({ customer: updated }) };
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid credit adjustment." }) };
  }
}

export default withNetlifyResponse(handler);
