import { clearAdminSessionCookie } from "./_shared/adminSession.js";
import { withNetlifyResponse } from "./_shared/response.js";

async function handler() {
  return {
    statusCode: 200,
    headers: { "Set-Cookie": clearAdminSessionCookie() },
    body: JSON.stringify({ ok: true }),
  };
}

export default withNetlifyResponse(handler);
