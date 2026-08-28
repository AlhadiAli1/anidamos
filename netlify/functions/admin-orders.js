import { getSupabaseAdmin } from "./_shared/supabase.js";
import { isAdminRequest } from "./_shared/adminSession.js";
import { withNetlifyResponse } from "./_shared/response.js";

async function handler(event) {
  if (!isAdminRequest(event)) {
    return { statusCode: 403, body: JSON.stringify({ error: "Administrator access required." }) };
  }

  const supabase = getSupabaseAdmin();
  const orderFields = "id, customer_id, total_amount, points_earned, payment_method, payment_status, credits_amount, items, created_at";
  const [{ data: pendingOrders, error }, { data: receivedOrders, error: receivedError }] = await Promise.all([
    supabase.from("orders").select(orderFields).eq("payment_status", "pending_whatsapp").order("created_at", { ascending: false }),
    supabase.from("orders").select(orderFields).eq("payment_status", "confirmed").order("created_at", { ascending: false }).limit(12),
  ]);

  if (error || receivedError) {
    const migrationMissing = /column .* does not exist/i.test(error.message || "");
    return { statusCode: 500, body: JSON.stringify({ error: migrationMissing ? "Run the order payment migration in Supabase before loading pending orders." : "Unable to load pending orders." }) };
  }

  const allOrders = [...(pendingOrders || []), ...(receivedOrders || [])];
  const customerIds = [...new Set(allOrders.map((order) => order.customer_id))];
  const { data: customers } = customerIds.length
    ? await supabase.from("customers").select("id, username, phone_nb").in("id", customerIds)
    : { data: [] };
  const customerMap = new Map((customers || []).map((customer) => [customer.id, customer]));
  const addCustomer = (order) => ({ ...order, customers: customerMap.get(order.customer_id) || null });
  const orders = (pendingOrders || []).map(addCustomer);
  const received = (receivedOrders || []).map(addCustomer);

  return { statusCode: 200, body: JSON.stringify({ orders, receivedOrders: received }) };
}

export default withNetlifyResponse(handler);
