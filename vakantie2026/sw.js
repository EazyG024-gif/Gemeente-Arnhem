/**
 * Minimale, afhankelijkheidsvrije service worker voor offline-gebruik onderweg.
 * Cachet bezochte pagina's en statische assets; geen Workbox, geen build-stap nodig.
 */

const CACHE_NAAM = 'vakantie2026-v1';
const BASE = new URL('.', self.location).pathname;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAAM).then((cache) => cache.addAll([BASE, `${BASE}manifest.webmanifest`])),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((sleutels) =>
      Promise.all(sleutels.filter((k) => k !== CACHE_NAAM).map((k) => caches.delete(k))),
    ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const kopie = response.clone();
        caches.open(CACHE_NAAM).then((cache) => cache.put(request, kopie));
        return response;
      })
      .catch(() => caches.match(request).then((gecached) => gecached ?? caches.match(BASE))),
  );
});
