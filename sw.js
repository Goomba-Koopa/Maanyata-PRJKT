/**
 * sw.js — Project Maanyata (मान्यता) Offline Service Worker
 * 
 * Invariant: 100% Offline Resilience (Gate Clearance in Cell-Dead Lobbies)
 * Strategy: Cache-First for static assets & vendor scripts, Network-First fallback.
 */

const CACHE_NAME = "maanyata-v4";
const OFFLINE_URLS = [
  "./",
  "./portfolio.html",
  "./directory.html",
  "./onboard.html",
  "./endorse.html",
  "./verify.html",
  "./physical_pass_card.html",
  "./rwa_pilot_proposal.html",
  "./maanyata_store.js",
  "./jsQR.js",
  "./tweetnacl.min.js",
  "./qr_engine.js"
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

self.addEventListener("fetch", (event) => {
  // Only intercept GET requests
  if (event.request.method !== "GET") return;

  // Bug 4 Fix: Network-only bypass for all dynamic API endpoints (never freeze live data)
  if (event.request.url.includes("/api/")) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached asset immediately
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Cache external font resources or fresh local files dynamically
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline fallback: if navigation fails, serve portfolio.html
        if (event.request.mode === "navigate") {
          return caches.match("./portfolio.html");
        }
      });
    })
  );
});
