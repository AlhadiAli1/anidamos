import bcrypt from "bcryptjs";
import { getSupabaseAdmin } from "./supabase.js";
import { getSessionFromRequest } from "./session.js";

export const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/;

export function normalizeUsername(value) {
  return String(value || "").trim();
}

export function normalizePhone(value) {
  return String(value || "").trim().replace(/[\s()-]/g, "");
}

export function validateUsername(value) {
  const username = normalizeUsername(value);
  if (!username) {
    throw new Error("Username is required.");
  }
  if (username.length < 3 || username.length > 24) {
    throw new Error("Username must be between 3 and 24 characters.");
  }
  if (!USERNAME_PATTERN.test(username)) {
    throw new Error("Username can only contain letters, numbers, dots, underscores, and hyphens.");
  }
  return username;
}

export function validatePassword(value) {
  const password = String(value || "");
  if (!password) {
    throw new Error("Password is required.");
  }
  return password;
}

export function validatePhone(value) {
  const phone = normalizePhone(value);
  if (!phone) throw new Error("Phone number is required.");
  if (!/^\+?[0-9.]{6,20}$/.test(phone)) {
    throw new Error("Enter a valid phone number.");
  }
  return phone;
}

export function getSafeCustomer(customer) {
  if (!customer) return null;
  return {
    id: customer.id,
    username: customer.username,
    phone_nb: customer.phone_nb,
    points_balance: Number(customer.points_balance ?? 0),
  };
}

export async function getAuthenticatedCustomer(event) {
  const session = getSessionFromRequest(event);
  if (!session || !session.sub) {
    throw new Error("Unauthorized");
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("customers")
    .select("id, username, phone_nb, points_balance")
    .eq("id", Number(session.sub))
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load your account.");
  }
  if (!data) {
    throw new Error("Unauthorized");
  }

  return data;
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}
