if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('เชื่อมต่อ sw.js สำเร็จ! Scope:', registration.scope);
      })
      .catch((error) => {
        console.error('เชื่อมต่อ sw.js ล้มเหลว:', error);
      });
  });
}
