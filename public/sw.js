// Minimal service worker to enable PWA install and basic offline capability
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Claim control immediately so the page is under SW control on first load
  event.waitUntil(self.clients.claim());
});

// Pass-through fetch to satisfy PWA criteria; customize caching later if needed
self.addEventListener('fetch', () => {
  // No-op: network-only by default
});
