// sw.js - Service Worker para PWA

const CACHE_NAME = 'rosario-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/biblia.js',
  '/biblia.json',
  '/manifest.json',
  '/icon-72.png',
  '/icon-96.png',
  '/icon-128.png',
  '/icon-144.png',
  '/icon-152.png',
  '/icon-192.png',
  '/icon-384.png',
  '/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap'
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
  const url = new URL(event.request.url);
  
  // ⚠️ CRÍTICO: Ignorar requisições Firebase e APIs externas
  const shouldNotCache = 
    url.hostname.includes('firebaseio.com') || 
    url.hostname.includes('googleapis.com') && url.pathname.includes('identitytoolkit') ||
    url.hostname.includes('gstatic.com') && url.pathname.includes('firebasejs') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    event.request.method !== 'GET';
  
  if (shouldNotCache) {
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
        }).catch(err => {
          console.error('Erro ao buscar:', err);
          
          // Retornar página offline se disponível
          return caches.match('/index.html');
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
    icon: '/icon-192.png',
    badge: '/icon-72.png',
    vibrate: [200, 100, 200],
    data: {
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
    self.registration.showNotification('Santo Rosário', options)
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
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // Se não existe, abrir nova
      if (clients.openWindow) {
        return clients.openWindow('/');
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
