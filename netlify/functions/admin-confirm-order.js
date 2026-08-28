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
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, customer_id, payment_method, payment_status, credits_amount, points_earned, total_amount")
      .eq("id", Number(orderId))
      .eq("payment_status", "pending_whatsapp")
      .single();

    if (orderError || !order) {
      return { statusCode: 404, body: JSON.stringify({ error: "Pending order not found." }) };
    }

    const creditsAmount = Number(order.credits_amount || 0);
    const isCreditPayment = order.payment_method === "credits";
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("points_balance")
      .eq("id", order.customer_id)
      .single();

    if (customerError || !customer) {
      return { statusCode: 404, body: JSON.stringify({ error: "Customer account not found." }) };
    }

    const currentBalance = Number(customer.points_balance || 0);
    const pointsChange = isCreditPayment ? -creditsAmount : Number(order.points_earned || 0);
    const newBalance = Number((currentBalance + pointsChange).toFixed(2));
    if (newBalance < 0) {
      return { statusCode: 400, body: JSON.stringify({ error: `Customer has insufficient credits. Balance: $${currentBalance.toFixed(2)}; required: $${creditsAmount.toFixed(2)}.` }) };
    }

    const { data: updatedCustomer, error: debitError } = await supabase
      .from("customers")
      .update({ points_balance: newBalance })
      .eq("id", order.customer_id)
      .select("points_balance")
      .single();

    if (debitError || !updatedCustomer) {
      return { statusCode: 500, body: JSON.stringify({ error: "Unable to update customer credits." }) };
    }

    const { error: transactionError } = await supabase.from("points_transactions").insert([{
      customer_id: order.customer_id,
      order_id: order.id,
      points: pointsChange,
      type: isCreditPayment ? "redeemed" : "earned",
      description: isCreditPayment
        ? `Paid Order #${order.id} with credits ($${creditsAmount.toFixed(2)} total)`
        : `Credits earned from confirmed Order #${order.id}`,
    }]);

    if (transactionError) {
      await supabase.from("customers").update({ points_balance: currentBalance }).eq("id", order.customer_id);
      return { statusCode: 500, body: JSON.stringify({ error: "Unable to record credit payment." }) };
    }

    const { error: confirmError } = await supabase
      .from("orders")
      .update({ payment_status: "confirmed" })
      .eq("id", order.id)
      .eq("payment_status", "pending_whatsapp");

    if (confirmError) {
      await supabase.from("customers").update({ points_balance: currentBalance }).eq("id", order.customer_id);
      return { statusCode: 500, body: JSON.stringify({ error: "Unable to confirm order." }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true, orderId: order.id, newBalance }) };
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid order confirmation." }) };
  }
}

export default withNetlifyResponse(handler);
