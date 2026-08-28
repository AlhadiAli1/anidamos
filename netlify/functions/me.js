import { getAuthenticatedCustomer, getSafeCustomer } from "./_shared/customer.js";
import { getSessionFromRequest } from "./_shared/session.js";
import { withNetlifyResponse } from "./_shared/response.js";

async function handler(event) {
  try {
    const session = getSessionFromRequest(event);
    if (!session || !session.sub) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: null }),
      };
    }

    const customer = await getAuthenticatedCustomer(event);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: getSafeCustomer(customer) }),
    };
  } catch {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: null }),
    };
  }
}

export default withNetlifyResponse(handler);
