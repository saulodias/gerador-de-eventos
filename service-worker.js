// Define a unique cache name for your PWA
const cacheName = 'my-pwa-cache-v1';

// List of assets to be cached when the service worker is installed
const cacheAssets = [
  '/',
  '/index.html',
  '/manifest.json',
//   '/icon.png',
  // Add paths to other important assets like CSS, JavaScript, and images
];

// Install event: Cache the assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        return cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event: Serve cached assets or fetch from the network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // If the asset is in the cache, return it
      if (response) {
        return response;
      }
      // If not, fetch from the network and add it to the cache
      return fetch(event.request).then((response) => {
        const responseClone = response.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      });
    })
  );
});
