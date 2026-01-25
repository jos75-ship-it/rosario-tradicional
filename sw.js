// sw.js - VERSÃO CORRIGIDA COM PATHS RELATIVOS

const CACHE_NAME = 'rosario-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
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
      .catch(err => {
        console.error('❌ Erro ao cachear:', err);
      })
  );
  self.skipWaiting();
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
  self.clients.claim();
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  // ⚠️ CRÍTICO: Ignorar requisições Firebase e APIs
  if (event.request.url.includes('firebaseio.com') || 
      event.request.url.includes('googleapis.com/identitytoolkit') ||
      event.request.url.includes('gstatic.com/firebasejs') ||
      event.request.url.includes('fonts.googleapis.com')) {
    return; // Deixar a requisição passar normalmente
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
          if (!response || response.status !== 200 || response.type === 'error') {
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
      .catch(err => {
        console.error('Erro ao buscar:', err);
        // Retornar página offline se disponível
        return new Response('Offline - Sem conexão com a internet', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
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
  console.log('🔄 Sincronizando orações...');
  // Sincronizar dados salvos localmente com Firebase
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Hora de rezar o Rosário! 🙏',
    icon: './icon-192.png',
    badge: './icon-72.png',
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

// Clique na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Procurar se já existe janela aberta
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === './' && 'focus' in client) {
          return client.focus();
        }
      }
      // Se não existe, abrir nova
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});
