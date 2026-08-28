import { getSupabaseAdmin } from "./_shared/supabase.js";
import { isAdminRequest } from "./_shared/adminSession.js";
import { withNetlifyResponse } from "./_shared/response.js";

async function handler(event) {
  if (!isAdminRequest(event)) {
    return { statusCode: 403, body: JSON.stringify({ error: "Administrator access required." }) };
  }

  const { data, error } = await getSupabaseAdmin()
    .from("customers")
    .select("id, username, phone_nb, points_balance")
    .order("username", { ascending: true });

  if (error) {
    return { statusCode: 500, body: JSON.stringify({ error: "Unable to load customers." }) };
  }

  return { statusCode: 200, body: JSON.stringify({ customers: data || [] }) };
}

export default withNetlifyResponse(handler);
