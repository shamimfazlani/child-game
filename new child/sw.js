// WonderKids Service Worker - Offline Cache for Google Play Store & PWA
// Created for Muhammad Shamim Fazlani
const CACHE_NAME = 'wonderkids-v1';
const ASSETS_TO_CACHE = [
  './',
  './shamim.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./shamim.html');
        }
      });
    })
  );
});
