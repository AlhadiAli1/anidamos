# Runs the delivery integration test against the in-memory mock Supabase,
# then guarantees the real supabase.js is restored.
$real = "netlify/functions/_shared/supabase.real.js"
$target = "netlify/functions/_shared/supabase.js"
$mock = "netlify/functions/_shared/supabase.mock.js"

# Point supabase.js at the mock (re-export its getSupabaseAdmin + helpers).
$mockRedirect = "export { getSupabaseAdmin } from './supabase.mock.js';" + "`n" + "export { __mockReset, __mockState, __seedAgent, __seedDelivery } from './supabase.mock.js';" + "`n"
try {
  Set-Content -LiteralPath $target -Value $mockRedirect -Encoding UTF8
  node test/_delivery_test.mjs
  $exit = $LASTEXITCODE
} finally {
  Copy-Item -LiteralPath $real -Destination $target -Force
}
Write-Output "supabase.js restored to real client."
exit $exit
