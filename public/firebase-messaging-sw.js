// Service Worker para o FitnessRPG (PWA + Firebase Cloud Messaging)

importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const CACHE_NAME = 'fitness-rpg-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css',
  '/src/App.tsx'
];

// Instalação do Service Worker e Cache de Ativos Estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Ignora falhas ao tentar cachear recursos de desenvolvimento
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.log('[SW] Ignorando cache de desenvolvimento inicial:', err);
      });
    })
  );
  self.skipWaiting();
});

// Ativação do Service Worker e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptador de Requisições (Estratégia Network-First como fallback para Cache)
self.addEventListener('fetch', (event) => {
  // Ignora requisições do Firebase e de APIs externas
  if (event.request.url.includes('googleapis.com') || event.request.url.includes('supabase') || event.request.url.includes('firebase')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se a resposta for válida, salva no cache
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback para o cache se estiver offline
        return caches.match(event.request);
      })
  );
});

// Configurações do Firebase Cloud Messaging inicializadas dinamicamente pelo cliente
let isFirebaseInitialized = false;

self.addEventListener('message', (event) => {
  if (!event.data) return;

  const { type, config, payload } = event.data;

  // Inicialização dinâmica do FCM com credenciais do cliente
  if (type === 'INITIALIZE_FIREBASE') {
    if (!isFirebaseInitialized && config) {
      try {
        firebase.initializeApp(config);
        const messaging = firebase.messaging();
        
        messaging.onBackgroundMessage((backgroundPayload) => {
          console.log('[SW] Mensagem em segundo plano recebida via FCM:', backgroundPayload);
          
          const title = backgroundPayload.notification?.title || '⚔️ Alerta do Sistema FitnessRPG';
          const options = {
            body: backgroundPayload.notification?.body || 'Treine hoje para manter o seu bônus de streak!',
            icon: '/assets/images/blue_crest_logo_1782655072782.jpg',
            badge: '/assets/images/blue_crest_logo_1782655072782.jpg',
            vibrate: [200, 100, 200],
            data: backgroundPayload.data || {}
          };
          
          self.registration.showNotification(title, options);
        });
        
        isFirebaseInitialized = true;
        console.log('[SW] Firebase Cloud Messaging inicializado com sucesso.');
      } catch (err) {
        console.error('[SW] Erro ao inicializar Firebase compat:', err);
      }
    }
  }

  // Permite que o cliente solicite um lembrete imediato para testes locais
  if (type === 'TRIGGER_TEST_NOTIFICATION') {
    const title = payload?.title || '⚔️ Treino de Jinwoo Pendente!';
    const options = {
      body: payload?.body || 'Seu horário preferido de treino está ativo. Vá ao painel!',
      icon: '/assets/images/blue_crest_logo_1782655072782.jpg',
      badge: '/assets/images/blue_crest_logo_1782655072782.jpg',
      vibrate: [100, 50, 100],
      data: { url: '/' }
    };
    
    self.registration.showNotification(title, options);
  }
});

// Ação ao clicar na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Abre a aba ou foca se já estiver aberta
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});
