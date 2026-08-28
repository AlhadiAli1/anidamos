import { getAuthenticatedCustomer } from "./_shared/customer.js";
import { getSupabaseAdmin } from "./_shared/supabase.js";
import { calculatePointsForOrder, calculateUsdTotal, parseCurrencyAmount } from "./_shared/points.js";
import { withNetlifyResponse } from "./_shared/response.js";

async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed." }),
      headers: { "Content-Type": "application/json" },
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const items = Array.isArray(body.items) ? body.items : [];
    const idempotencyKey = String(body.idempotencyKey || "").trim();
    const paymentMethod = body.paymentMethod === "credits" ? "credits" : "whatsapp";

    if (!items.length) {
      throw new Error("Cart is empty.");
    }

    const customer = await getAuthenticatedCustomer(event);
    const supabase = getSupabaseAdmin();

    if (idempotencyKey) {
      const { data: existingOrder, error: duplicateError } = await supabase
        .from("orders")
        .select("id, payment_status")
        .eq("customer_id", customer.id)
        .eq("idempotency_key", idempotencyKey)
        .maybeSingle();

      if (!duplicateError && existingOrder) {
        return {
          statusCode: 409,
          body: JSON.stringify({ error: existingOrder.payment_status === "pending_whatsapp" ? "This credit order is waiting for cashier confirmation." : "Duplicate order detected." }),
          headers: { "Content-Type": "application/json" },
        };
      }
    }

    const totalAmount = items.reduce((sum, item) => {
      const unitPrice = typeof item.price === "number" ? item.price : parseCurrencyAmount(item.price);
      const qty = Number(item.qty || 1);
      return sum + unitPrice * qty;
    }, 0);

    const usdTotal = calculateUsdTotal(totalAmount, "LBP");
    const creditsRequired = usdTotal;
    const pointsEarned = paymentMethod === "credits" ? 0 : calculatePointsForOrder(totalAmount, "LBP");

    const paymentStatus = "pending_whatsapp";
    const balanceAfterPayment = Number(customer.points_balance || 0);
    if (paymentMethod === "credits" && creditsRequired > balanceAfterPayment) {
      throw new Error(`Insufficient credits. This order costs $${usdTotal.toFixed(2)} and your balance is $${balanceAfterPayment.toFixed(2)}.`);
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          customer_id: customer.id,
          total_amount: Number(totalAmount).toFixed(2),
          points_earned: pointsEarned,
          payment_method: paymentMethod,
          payment_status: paymentStatus,
          credits_amount: paymentMethod === "credits" ? creditsRequired : 0,
          idempotency_key: idempotencyKey || null,
          items,
        },
      ])
      .select("id, total_amount, points_earned")
      .single();

    if (orderError || !order) {
      throw new Error("Unable to create order.");
    }

    const updatedBalance = balanceAfterPayment;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: true,
        paymentMethod,
        paymentStatus,
        usdTotal,
        creditsRequired,
        pointsEarned,
        newBalance: updatedBalance,
      }),
    };
  } catch (error) {
    return {
      statusCode: error.message === "Unauthorized" ? 401 : 400,
      body: JSON.stringify({ error: error.message || "Unable to process order." }),
      headers: { "Content-Type": "application/json" },
    };
  }
}

export default withNetlifyResponse(handler);
