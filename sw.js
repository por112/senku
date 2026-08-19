const CACHE_NAME = 'senku-v1';

// รายชื่อไฟล์ที่ต้องการให้เปิดเล่นได้แม้ออฟไลน์
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
  // เพิ่มไฟล์ CSS/JS หลักที่คุณใช้งานลงตรงนี้ได้ เช่น '/src/main.jsx', '/src/index.css'
];

// 1. ขั้นตอน Install: สั่งโหลดไฟล์เก็บลง Cache ทันที
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell & offline page');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. ขั้นตอน Activate: ลบ Cache เก่าที่ไม่ได้ใช้ทิ้งเมื่อมีการอัปเดตเวอร์ชัน
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. ขั้นตอน Fetch: ดักจับการขอไฟล์ ถ้าไม่มีเน็ต ให้ดึงจาก Cache หรือแสดงหน้า offline.html
self.addEventListener('fetch', (event) => {
  // รองรับเฉพาะ Request แบบ GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // ถ้าดึงข้อมูลจากเน็ตสำเร็จ ให้อัปเดตข้อมูลลง Cache ล่าสุดไปด้วย
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(async () => {
        // เมื่อเน็ตหลุด / ออฟไลน์
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // ถ้าเป็น Navigation request (เปิดหน้าเว็บใหม่) แล้วไม่มีใน Cache ให้ส่งหน้า offline.html ไปแสดง
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      })
  );
});
