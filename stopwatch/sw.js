/* sw.js – Focus Stopwatch v1
   Caches the app shell so it works offline and updates
   itself quietly when you publish a new version.         */

const CACHE_NAME = 'focus-stopwatch-2025-07-17';          // bump on each release
const ASSETS = [
  '/',                       // root → stopwatch.html
  '/stopwatch.html',
  '/manifest.json',
  '/favicon.png',
  '/sw.js'
  // add other assets here (images, sounds, etc.)
];

// ----- Install: cache everything we need -----
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();        // activate immediately
});

// ----- Activate: clean up old caches -----
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME) && caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ----- Fetch: network‑first, fallback to cache -----
self.addEventListener('fetch', event => {
  // Only handle same‑origin GET requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(resp => {
        // fresh copy → put a clone in cache for next time
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        return resp;
      })
      .catch(() => caches.match(event.request))   // offline fallback
  );
});
