export function parseCurrencyAmount(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  }

  const raw = String(value ?? "").trim();
  if (!raw) return 0;

  const normalized = raw
    .replace(/\s+/g, " ")
    .replace(/,/g, "")
    .replace(/[$]/g, "")
    .replace(/[A-Za-z]/g, "")
    .replace(/[^0-9.]/g, "");

  if (!normalized) return 0;

  const numericValue = Number(normalized);
  if (!Number.isFinite(numericValue)) return 0;

  return Math.max(0, Math.floor(numericValue));
}

export function detectCurrency(value) {
  const raw = String(value ?? "").trim().toUpperCase();
  if (!raw) return "LBP";
  if (raw.includes("USD") || raw.includes("$") || raw.includes("US$")) return "USD";
  if (raw.includes("LBP") || raw.includes("L.L.") || raw.includes("LL")) return "LBP";
  return "LBP";
}

export function calculatePointsForOrder(totalAmount, currency) {
  const rawValue = typeof totalAmount === "number" ? totalAmount : parseCurrencyAmount(totalAmount);
  const resolvedCurrency = currency || detectCurrency(totalAmount ?? "");
  const usdValue = resolvedCurrency === "LBP" ? rawValue / 89000 : rawValue;
  return Number(Math.max(0, usdValue / 10).toFixed(2));
}

export function calculateUsdTotal(totalAmount, currency = "LBP") {
  const rawValue = typeof totalAmount === "number" ? totalAmount : parseCurrencyAmount(totalAmount);
  const usdValue = currency === "LBP" ? rawValue / 89000 : rawValue;
  return Number(Math.max(0, usdValue).toFixed(2));
}
