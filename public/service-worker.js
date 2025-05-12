const CACHE_NAME = 'task-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/login.html',
  '/signup.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icons/image.png',
  '/icons/image.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
});
