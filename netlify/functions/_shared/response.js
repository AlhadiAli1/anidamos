export function withNetlifyResponse(handler) {
  return async (...args) => {
    const [request] = args;
    const event = request instanceof Request
      ? {
          httpMethod: request.method,
          body: await request.text(),
          headers: Object.fromEntries(request.headers.entries()),
          path: new URL(request.url).pathname + new URL(request.url).search,
        }
      : request;

    try {
      const result = await handler(event);
      if (result instanceof Response || result === undefined) return result;
      return new Response(result.body || "", {
        status: result.statusCode || 200,
        headers: result.headers,
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message || "Internal error." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  };
}

export function json(body, statusCode = 200) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
