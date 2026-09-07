// Offline application shell; update this version whenever shell files change.
const CACHE_NAME = 'rosario-v6';
const urlsToCache = [
  '/', '/index.html', '/style.css', '/prayers.js', '/prayers.json',
  '/config.js', '/biblia.js', '/biblia.json', '/manifest.json',
  '/icon-72.png', '/icon-192.png', '/icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('rosario-') && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok) {
        await cache.put(request, response.clone());
      }
      return response;
    } catch {
      // Never return HTML in place of a missing script, image or JSON resource.
      if (request.mode === 'navigate') return (await cache.match('/index.html')) || Response.error();
      return Response.error();
    }
  })());
});

// Sincronização em background
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-prayers') {
    event.waitUntil(syncPrayers());
  }
});

async function syncPrayers() {
  console.log('🔄 Sincronizando orações...');
  // Sincronizar dados salvos localmente com Firebase
}

// Push notifications
self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = { body: event.data ? event.data.text() : '' };
  }

  const notificationTitle = payload.title || 'Santo Rosário';
  const options = {
    body: payload.body || 'Hora de rezar o Rosário! 🙏',
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    vibrate: [200, 100, 200],
    data: {
      url: payload.url || '/',
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir',
        icon: '/icon-72.png'
      },
      {
        action: 'close',
        title: 'Fechar'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(notificationTitle, options)
  );
});

// Clique na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Procurar se já existe janela aberta
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if ('focus' in client) {
          return client.focus();
        }
      }
      // Se não existe, abrir nova
      if (clients.openWindow) {
        const destination = event.notification?.data?.url || '/';
        return clients.openWindow(destination);
      }
    })
  );
});

// Mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
