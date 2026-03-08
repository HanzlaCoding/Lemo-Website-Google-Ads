self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('limo-v1').then(cache =>
      cache.addAll(['/', '/styles.min.css'])
    )
  );
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
