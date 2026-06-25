const CACHE_NAME = 'readbridge-pwa-cache-v19';

// Terima perintah SKIP_WAITING dari halaman (tombol "Perbarui" di banner)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

// Aset statis yang aman di-cache lama (images, icons, fonts)
const STATIC_ASSETS = [
  './icon-192.png',
  './icon-512.png',
  './manifest.json',
];

// ─── Install: cache aset statis saja ─────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  // Langsung aktif tanpa tunggu tab lama ditutup
  self.skipWaiting();
});

// ─── Activate: hapus cache lama, ambil kontrol semua tab ────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => {
      self.clients.claim();
      // Beritahu semua tab bahwa SW versi baru sudah aktif
      self.clients.matchAll({ type: 'window' }).then(clients => {
        clients.forEach(client => client.postMessage({ type: 'sw-updated' }));
      });
    })
  );
});

// ─── Fetch: strategi berdasarkan tipe file ───────────────────────────────────
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isAPI = url.pathname.includes('/api/') || url.hostname.includes('readbridge-backend');
  const isExternal = url.hostname.includes('cloudinary') ||
                     url.hostname.includes('googleapis') ||
                     url.hostname.includes('dicebear') ||
                     url.hostname.includes('fonts.g') ||
                     url.hostname.includes('lh3.google');

  // Jangan intercept API atau eksternal CDN
  if (isAPI || isExternal || !isSameOrigin) return;

  const isStaticAsset = /\.(png|jpg|jpeg|webp|svg|ico|woff2?|ttf)$/i.test(url.pathname);
  const isNavigate = event.request.mode === 'navigate';

  if (isStaticAsset) {
    // Cache-first untuk gambar & font (jarang berubah)
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          }
          return res;
        });
      })
    );
  } else {
    // Network-first untuk HTML, JS, CSS — selalu ambil versi terbaru dari server
    event.respondWith(
      fetch(event.request)
        .then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          }
          return res;
        })
        .catch(() => {
          // Offline fallback: sajikan dari cache
          return caches.match(event.request).then(cached => {
            if (cached) return cached;
            if (isNavigate) return caches.match('./index.html');
          });
        })
    );
  }
});
