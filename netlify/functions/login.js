import { getSupabaseAdmin } from "./_shared/supabase.js";
import { buildSessionCookie } from "./_shared/session.js";
import { getSafeCustomer, normalizePhone, validatePassword, verifyPassword } from "./_shared/customer.js";
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
    const identifier = String(body.username || body.phone || "").trim();
    if (!identifier) throw new Error("Username or phone number is required.");
    const password = validatePassword(body.password);

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("customers")
      .select("id, username, phone_nb, password_hash, points_balance")
      .or(`username.eq.${identifier},phone_nb.eq.${normalizePhone(identifier)}`)
      .maybeSingle();

    if (error || !data) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid username or password." }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const validPassword = await verifyPassword(password, data.password_hash);
    if (!validPassword) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid username or password." }),
        headers: { "Content-Type": "application/json" },
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": buildSessionCookie({
          id: data.id,
          username: data.username,
        }),
      },
      body: JSON.stringify({ user: getSafeCustomer(data) }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message || "Invalid username or password." }),
      headers: { "Content-Type": "application/json" },
    };
  }
}

export default withNetlifyResponse(handler);
