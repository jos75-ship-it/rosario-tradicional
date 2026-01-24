const CACHE_NAME = 'rosario-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,400;1,400&display=swap'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Ativando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  // Ignorar requisições Firebase
  if (event.request.url.includes('firebaseio.com') || 
      event.request.url.includes('googleapis.com/identitytoolkit') ||
      event.request.url.includes('gstatic.com/firebasejs')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retornar resposta do cache
        if (response) {
          return response;
        }

        // Clone da requisição
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Checar se resposta é válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone da resposta
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// Sincronização em background
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-prayers') {
    event.waitUntil(syncPrayers());
  }
});

async function syncPrayers() {
  // Sincronizar orações salvas localmente com Firebase
  console.log('🔄 Sincronizando orações...');
}

// Push notifications (para futuro)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Hora de rezar o Rosário! 🙏',
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Santo Rosário', options)
  );
});
