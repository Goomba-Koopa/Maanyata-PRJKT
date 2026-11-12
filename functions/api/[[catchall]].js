// functions/api/[[catchall]].js
// Project Maanyata — Edge API 404 & Fallback Guard
// Intercepts unmatched /api/* requests and returns a structured JSON error

export async function onRequest(context) {
  const url = new URL(context.request.url);
  return new Response(JSON.stringify({
    success: false,
    error: `API route '${url.pathname}' not found on Project Maanyata Edge Engine.`
  }), {
    status: 404,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "no-store"
    }
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
