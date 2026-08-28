import { adminConfigurationReady, isAdminRequest } from "./_shared/adminSession.js";
import { withNetlifyResponse } from "./_shared/response.js";

async function handler(event) {
  if (!adminConfigurationReady() || !isAdminRequest(event)) {
    return { statusCode: 401, body: JSON.stringify({ authenticated: false }) };
  }

  return { statusCode: 200, body: JSON.stringify({ authenticated: true }) };
}

export default withNetlifyResponse(handler);
