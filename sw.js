const CACHE_NAME = 'qf-golf-35-v1';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Install Event: Precache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event: Cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Caching Strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Cache-first for CDN resources (React, Tailwind, Lucide, ESM)
  if (
    url.hostname.includes('aistudiocdn.com') ||
    url.hostname.includes('cdn.tailwindcss.com') ||
    url.hostname.includes('esm.sh') ||
    url.hostname.includes('icons8.com')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((networkResponse) => {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        });
      })
    );
    return;
  }

  // Network-first for everything else (Network falling back to cache)
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Update cache with fresh version
        if (event.request.method === 'GET' && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});