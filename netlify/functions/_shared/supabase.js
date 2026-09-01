import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdmin as getMockSupabaseAdmin } from "./supabase.mock.js";

export function getSupabaseAdmin() {
  if (process.env.DELIVERY_USE_MOCK_SUPABASE === "true") {
    return getMockSupabaseAdmin();
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase server configuration.");
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
