import { buildAdminSessionCookie, validateAdminCredentials } from "./_shared/adminSession.js";
import { withNetlifyResponse } from "./_shared/response.js";

async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed." }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const valid = await validateAdminCredentials(body.username, body.password);

    if (!valid) {
      return { statusCode: 401, body: JSON.stringify({ error: "Invalid administrator credentials." }) };
    }

    return {
      statusCode: 200,
      headers: { "Set-Cookie": buildAdminSessionCookie() },
      body: JSON.stringify({ ok: true }),
    };
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Unable to sign in." }) };
  }
}

export default withNetlifyResponse(handler);
