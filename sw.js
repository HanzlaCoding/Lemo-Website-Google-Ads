const CACHE_NAME = 'limo-v7';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(['/', '/index.html', '/script.min.js'])
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // 1. Bypass non-GET requests immediately
  if (e.request.method !== 'GET') return;

  // 2. Bypass non-HTTP(S) protocols (like ws:// for LiveServer)
  if (!e.request.url.startsWith('http')) return;

  // 3. Bypass third-party APIs
  if (e.request.url.includes('openstreetmap.org') || e.request.url.includes('api.emailjs.com')) return;

  // 4. Bypass LiveServer internal requests
  if (e.request.url.includes('/ws')) return;

  // 5. Fix for DevTools cache bug
  if (e.request.cache === 'only-if-cached' && e.request.mode !== 'same-origin') return;

  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      // Return cached response if found
      if (cachedResponse) return cachedResponse;

      // Otherwise fetch from network
      return fetch(e.request).catch(err => {
        // If network fetch fails (e.g. offline or dev server restarted),
        // we MUST return a valid Response to prevent "TypeError" crashes.
        return new Response('Offline Configuration', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
    })
  );
});
