import { getAuthenticatedCustomer } from "./_shared/customer.js";
import { getSupabaseAdmin } from "./_shared/supabase.js";
import { withNetlifyResponse } from "./_shared/response.js";

async function handler(event) {
  try {
    const customer = await getAuthenticatedCustomer(event);
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("points_transactions")
      .select("id, points, type, description, created_at")
      .eq("customer_id", customer.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      throw new Error("Unable to load points history.");
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactions: data || [] }),
    };
  } catch (error) {
    return {
      statusCode: error.message === "Unauthorized" ? 401 : 400,
      body: JSON.stringify({ error: error.message || "Unable to load points history." }),
      headers: { "Content-Type": "application/json" },
    };
  }
}

export default withNetlifyResponse(handler);
