// GET /api/worker/[id] - Fetch an authentic worker passbook by ID
import { getKVWorker, stripZeroWidth } from "../_common.js";

export async function onRequestGet(context) {
  const rawId = context.params.id;
  const id = stripZeroWidth(rawId || "").slice(0, 60);
  const kv = context.env.MAANYATA_KV;

  if (!id) {
    return new Response(JSON.stringify({ success: false, error: "Worker ID is required." }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  const worker = await getKVWorker(kv, id);

  if (!worker) {
    return new Response(JSON.stringify({ success: false, error: "Worker passbook not found." }), {
      status: 404,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  return new Response(JSON.stringify({ success: true, worker }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=5, s-maxage=15",
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
