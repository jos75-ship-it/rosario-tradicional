// O app web foi aposentado. Este service worker apaga o cache antigo,
// se desinstala e recarrega as abas abertas para mostrar a página nova.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach((c) => c.navigate(c.url).catch(() => {}));
  })());
});
