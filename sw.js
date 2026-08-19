const CACHE_NAME = 'senku-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.jsx', // หรือเปลี่ยนตามโครงสร้างไฟล์ของคุณ
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
