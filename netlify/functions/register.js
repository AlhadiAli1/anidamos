import { getSupabaseAdmin } from "./_shared/supabase.js";
import { buildSessionCookie } from "./_shared/session.js";
import {
  getSafeCustomer,
  hashPassword,
  normalizeUsername,
  validatePhone,
  validatePassword,
  validateUsername,
} from "./_shared/customer.js";
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
    const username = validateUsername(body.username);
    const phoneNumber = validatePhone(body.phone);
    const password = validatePassword(body.password);
    const confirmPassword = String(body.confirmPassword || "");

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    const supabase = getSupabaseAdmin();
    const existing = await supabase
      .from("customers")
      .select("id")
      .eq("username", normalizeUsername(username))
      .maybeSingle();

    if (existing.error) {
      throw new Error("Unable to validate your username.");
    }
    if (existing.data) {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: "Username is already taken." }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const existingPhone = await supabase
      .from("customers")
      .select("id")
      .eq("phone_nb", phoneNumber)
      .maybeSingle();
    if (existingPhone.error) throw new Error("Unable to validate your phone number.");
    if (existingPhone.data) {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: "Phone number is already registered." }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const passwordHash = await hashPassword(password);

    const { data, error } = await supabase
      .from("customers")
      .insert([
        {
          username,
          phone_nb: phoneNumber,
          password_hash: passwordHash,
          points_balance: 0,
        },
      ])
      .select("id, username, phone_nb, points_balance")
      .single();

    if (error || !data) {
      throw new Error("Unable to create your account.");
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": buildSessionCookie({ id: data.id, username: data.username }),
      },
      body: JSON.stringify({ user: getSafeCustomer(data) }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message || "Unable to register account." }),
      headers: { "Content-Type": "application/json" },
    };
  }
}

export default withNetlifyResponse(handler);
