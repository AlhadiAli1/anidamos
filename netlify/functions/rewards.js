import { getAuthenticatedCustomer } from "./_shared/customer.js";
import { getSupabaseAdmin } from "./_shared/supabase.js";
import { withNetlifyResponse } from "./_shared/response.js";

async function handler(event) {
  try {
    await getAuthenticatedCustomer(event);
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("rewards")
      .select("id, name, description, points_required, active")
      .eq("active", true)
      .order("points_required", { ascending: true });

    if (error) {
      throw new Error("Unable to load rewards.");
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rewards: data || [] }),
    };
  } catch (error) {
    return {
      statusCode: error.message === "Unauthorized" ? 401 : 400,
      body: JSON.stringify({ error: error.message || "Unable to load rewards." }),
      headers: { "Content-Type": "application/json" },
    };
  }
}

export default withNetlifyResponse(handler);
