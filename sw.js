/**
 * sw.js — Project Maanyata (मान्यता) Offline Service Worker
 * 
 * Invariant: 100% Offline Resilience (Gate Clearance in Cell-Dead Lobbies)
 * Strategy: Network-First for HTML Navigations, Stale-While-Revalidate with 7-Day TTL for Assets & Worker API
 * Cache Version: maanyata-v12-live
 */

const CACHE_NAME = "maanyata-v12-live";
const MAX_CACHE_AGE_MS = 7 * 86400 * 1000; // 7 days TTL

const OFFLINE_URLS = [
  "./",
  "./index.html",
  "./portfolio.html",
  "./directory.html",
  "./onboard.html",
  "./endorse.html",
  "./verify.html",
  "./rwa_pilot_proposal.html",
  "./sandstone_dossier.html",
  "./vasudev_dossier.html",
  "./index_beta.html",
  "./manifest.webmanifest",
  "./maanyata_store.js",
  "./jsQR.js",
  "./tweetnacl.min.js",
  "./qr_engine.js",
  "./js/portfolio.js",
  "./js/aadhaar_verifier.js",
  "./js/dispute_modal.js",
  "./css/portfolio.css",
  "./styles.css",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper: Wrap a response with a timestamp header for cache expiration tracking
async function responseWithTimestamp(response) {
  const headers = new Headers(response.headers);
  headers.set("X-Maanyata-Cached-At", Date.now().toString());
  const body = await response.clone().blob();
  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
}

// Helper: Check if a cached response has exceeded the 7-day TTL
function isCacheExpired(cachedResponse) {
  if (!cachedResponse) return true;
  const cachedAt = cachedResponse.headers.get("X-Maanyata-Cached-At");
  if (!cachedAt) {
    const dateHeader = cachedResponse.headers.get("date");
    if (!dateHeader) return false;
    const dateMs = new Date(dateHeader).getTime();
    if (isNaN(dateMs)) return false;
    return (Date.now() - dateMs) > MAX_CACHE_AGE_MS;
  }
  const age = Date.now() - parseInt(cachedAt, 10);
  return age > MAX_CACHE_AGE_MS;
}

// Helper: Route clean URL navigation to corresponding cached file
async function getCachedNavigationResponse(cache, pathname) {
  const clean = (pathname === "/" || !pathname) ? "/" : pathname.replace(/\/+$/, "");

  if (clean === "/" || clean === "/index" || clean === "/index.html") {
    return (await cache.match("./index.html")) || (await cache.match("./"));
  }
  if (clean.endsWith("/verify") || clean.endsWith("/verify.html")) {
    return cache.match("./verify.html");
  }
  if (clean.endsWith("/directory") || clean.endsWith("/directory.html")) {
    return cache.match("./directory.html");
  }
  if (clean.endsWith("/onboard") || clean.endsWith("/onboard.html")) {
    return cache.match("./onboard.html");
  }
  if (clean.endsWith("/endorse") || clean.endsWith("/endorse.html")) {
    return cache.match("./endorse.html");
  }
  if (clean.endsWith("/proposal") || clean.endsWith("/rwa_pilot_proposal") || clean.endsWith("/rwa_pilot_proposal.html")) {
    return cache.match("./rwa_pilot_proposal.html");
  }
  if (clean.endsWith("/portfolio") || clean.endsWith("/portfolio.html")) {
    return cache.match("./portfolio.html");
  }
  if (clean.endsWith("/sandstone_dossier") || clean.endsWith("/sandstone_dossier.html")) {
    return cache.match("./sandstone_dossier.html");
  }
  if (clean.endsWith("/vasudev_dossier") || clean.endsWith("/vasudev_dossier.html")) {
    return cache.match("./vasudev_dossier.html");
  }
  if (clean.endsWith("/beta") || clean.endsWith("/index_beta.html")) {
    return cache.match("./index_beta.html");
  }
  return (await cache.match(pathname)) || (await cache.match("./index.html")) || (await cache.match("./portfolio.html"));
}

self.addEventListener("fetch", (event) => {
  // Only intercept GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Network-First for HTML navigation requests (Guarantees user always sees fresh code when online)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(async (networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const timestamped = await responseWithTimestamp(networkResponse);
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request, timestamped);
            return networkResponse;
          }
          if (networkResponse && networkResponse.status >= 500) {
            // Server error / gateway drop: fallback to cached passbook
            const cache = await caches.open(CACHE_NAME);
            const cached = await getCachedNavigationResponse(cache, url.pathname);
            if (cached) return cached;
          }
          return networkResponse;
        })
        .catch(async () => {
          // Fallback to offline cached HTML when network fails (cell-dead lobbies)
          const cache = await caches.open(CACHE_NAME);
          const cached = await getCachedNavigationResponse(cache, url.pathname);
          return cached || new Response("Offline - Project Maanyata Passbook", {
            status: 200,
            headers: { "Content-Type": "text/html; charset=utf-8" }
          });
        })
    );
    return;
  }

  // Stale-While-Revalidate with TTL for static assets and Worker API routes
  const isApiRoute = url.pathname.startsWith("/api/worker");
  const isStaticAsset = OFFLINE_URLS.some(u => {
    const base = u.replace("./", "");
    return url.pathname.endsWith(base) || (base.endsWith(".html") && url.pathname.endsWith(base.replace(".html", "")));
  });

  if (isApiRoute || isStaticAsset) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        // Direct match or clean URL resolution
        let cachedResponse = await cache.match(event.request);
        if (!cachedResponse && event.request.mode === "navigate") {
          cachedResponse = await getCachedNavigationResponse(cache, url.pathname);
        }

        // Background network revalidation
        const fetchPromise = fetch(event.request).then(async (networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const timestamped = await responseWithTimestamp(networkResponse);
            cache.put(event.request, timestamped.clone());
            return networkResponse;
          }
          return networkResponse;
        }).catch(() => null);

        // If cached and not expired, serve stale while revalidating in background
        if (cachedResponse && !isCacheExpired(cachedResponse)) {
          return cachedResponse;
        }

        // If expired or not in cache, wait for network
        const freshResponse = await fetchPromise;
        if (freshResponse) return freshResponse;

        // Fallback: if network failed and we have an expired cache, return it (graceful offline degradation)
        if (cachedResponse) return cachedResponse;

        // Navigation fallback
        if (event.request.mode === "navigate") {
          return getCachedNavigationResponse(cache, url.pathname);
        }

        return new Response("Offline / Resource Unavailable", { status: 503 });
      })
    );
    return;
  }

  // Default handler for all other requests
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse && !isCacheExpired(cachedResponse)) {
        return cachedResponse;
      }
      return fetch(event.request).then(async (networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const timestamped = await responseWithTimestamp(networkResponse);
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, timestamped);
        }
        return networkResponse;
      }).catch(async () => {
        if (cachedResponse) return cachedResponse;
        if (event.request.mode === "navigate") {
          const cache = await caches.open(CACHE_NAME);
          return getCachedNavigationResponse(cache, url.pathname);
        }
        return new Response("Resource unavailable offline", { status: 503, headers: { "Content-Type": "text/plain" } });
      });
    })
  );
});
