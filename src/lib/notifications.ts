import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Firebase configuration from Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if basic credentials exist
const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId
);

let messaging: any = null;

// Initializer function for Firebase and Service Worker registration
export const initializeNotifications = async (): Promise<{ token: string | null; mode: 'fcm' | 'mock' }> => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return { token: null, mode: 'mock' };
  }

  try {
    // 1. Register PWA / Firebase Messaging Service Worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/',
    });
    console.log('[Notifications] Service Worker registrado com sucesso:', registration);

    // Wait until service worker is active to post message
    if (registration.installing) {
      await new Promise<void>((resolve) => {
        registration.installing?.addEventListener('statechange', (e) => {
          if ((e.target as any).state === 'activated') resolve();
        });
      });
    }

    // Pass Firebase credentials to the service worker to initialize FCM background messaging
    if (isFirebaseConfigured && registration.active) {
      registration.active.postMessage({
        type: 'INITIALIZE_FIREBASE',
        config: firebaseConfig,
      });
    }

    // 2. Return credentials mode based on configuration
    if (isFirebaseConfigured) {
      try {
        const app = initializeApp(firebaseConfig);
        messaging = getMessaging(app);

        // Listen for foreground FCM messages
        onMessage(messaging, (payload) => {
          console.log('[Notifications] Mensagem FCM recebida em primeiro plano:', payload);
          if (payload.notification) {
            new Notification(payload.notification.title || '✨ Fitness Evolution', {
              body: payload.notification.body,
              icon: '/assets/images/blue_crest_logo_1782655072782.jpg',
            });
          }
        });

        // Get VAPID public key
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
        const token = await getToken(messaging, {
          serviceWorkerRegistration: registration,
          vapidKey: vapidKey || undefined,
        });

        return { token, mode: 'fcm' };
      } catch (fcmError) {
        console.warn('[Notifications] Erro ao obter Token real do FCM, usando fallback de simulação:', fcmError);
        return { token: 'simulated_fcm_token_' + Math.random().toString(36).substr(2, 9), mode: 'mock' };
      }
    } else {
      console.log('[Notifications] Firebase não configurado no arquivo .env. Usando modo de Simulação Local para testes.');
      return { token: 'simulated_fcm_token_dev_environment', mode: 'mock' };
    }
  } catch (error) {
    console.error('[Notifications] Falha ao inicializar sistema de notificações:', error);
    return { token: null, mode: 'mock' };
  }
};

// Requests permission from user and retrieves the FCM Token if allowed
export const requestNotificationPermission = async (): Promise<string | null> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('[Notifications] Notificações não são suportadas neste navegador.');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('[Notifications] Permissão concedida!');
      const { token } = await initializeNotifications();
      return token;
    } else {
      console.warn('[Notifications] Permissão de notificação negada pelo usuário.');
      return null;
    }
  } catch (error) {
    console.error('[Notifications] Erro ao solicitar permissão de notificação:', error);
    return null;
  }
};

// Immediately trigger a test notification using the Service Worker
export const triggerTestNotification = async (title: string, body: string) => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    if (registration.active) {
      registration.active.postMessage({
        type: 'TRIGGER_TEST_NOTIFICATION',
        payload: { title, body },
      });
    }
  } else if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/assets/images/blue_crest_logo_1782655072782.jpg',
    });
  }
};
