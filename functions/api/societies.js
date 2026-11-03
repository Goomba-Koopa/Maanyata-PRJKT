// GET /api/societies - Serve verified pilot societies and wing/flat structure
import { PILOT_SOCIETIES } from "./_common.js";

export async function onRequestGet() {
  return new Response(JSON.stringify({
    success: true,
    societies: PILOT_SOCIETIES
  }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600, s-maxage=7200",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
