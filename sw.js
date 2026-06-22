const CACHE_NAME = 'readbridge-pwa-cache-v15';
const urlsToCache = [
  './index.html',
  './style.css',
  './main.js',
  './icon-192.png',
  './icon-512.png',
  './manifest.json'
];

// Instalasi Service Worker & Cache File Dasar
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Menghapus cache lama
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Intercept fetch requests
self.addEventListener('fetch', event => {
  // Hanya intercept GET requests
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;
  const isApiRequest = requestUrl.pathname.includes('/api/') || requestUrl.hostname.includes('readbridge-backend');
  const isAuthPage = requestUrl.pathname.includes('login.html') || 
                     requestUrl.pathname.includes('google-login.html') || 
                     requestUrl.pathname.includes('auth-handler.html') || 
                     requestUrl.pathname.includes('rb-google-login.js') ||
                     requestUrl.pathname.includes('auth-logout.js');

  // Jangan sentuh request auth/API/CDN eksternal. Di mode PWA mobile, fallback cache
  // untuk navigasi eksternal bisa membuat proses login Google terlihat gagal.
  if (!isSameOrigin || isApiRequest || isAuthPage) {
    console.log('[SW] Skipping cache for:', requestUrl.pathname);
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika file ada di cache, gunakan file tersebut (offline support)
        if (response) {
          console.log('[SW] Serving from cache:', requestUrl.pathname);
          return response;
        }
        
        // Jika tidak ada di cache, ambil dari network
        return fetch(event.request).then(
          function(response) {
            // Jangan cache jika request gagal atau bukan dari origin yang sama
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone response karena response berupa stream dan hanya bisa dipakai sekali
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(() => {
          // Fallback sederhana jika offline dan tidak ada di cache
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
