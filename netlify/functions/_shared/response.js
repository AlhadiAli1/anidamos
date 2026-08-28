export function withNetlifyResponse(handler) {
  return async (...args) => {
    const [request] = args;
    const event = request instanceof Request
      ? {
          httpMethod: request.method,
          body: await request.text(),
          headers: Object.fromEntries(request.headers.entries()),
        }
      : request;
    const result = await handler(event);

    if (result instanceof Response || result === undefined) {
      return result;
    }

    return new Response(result.body || "", {
      status: result.statusCode || 200,
      headers: result.headers,
    });
  };
}
