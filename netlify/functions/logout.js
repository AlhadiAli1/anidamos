import { clearSessionCookie } from "./_shared/session.js";
import { withNetlifyResponse } from "./_shared/response.js";

async function handler() {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": clearSessionCookie(),
    },
    body: JSON.stringify({ ok: true }),
  };
}

export default withNetlifyResponse(handler);
