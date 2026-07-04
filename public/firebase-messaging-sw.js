importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

let messagingInstance = null;

// The service worker cannot access import.meta.env directly.
// The main app sends the Firebase config via postMessage after registration.
self.addEventListener('message', (event) => {
  if (event.data?.type === 'FIREBASE_CONFIG' && !messagingInstance) {
    const firebaseConfig = event.data.config;

    firebase.initializeApp(firebaseConfig);
    messagingInstance = firebase.messaging();

    messagingInstance.onBackgroundMessage((payload) => {
      console.log('[firebase-messaging-sw.js] Received background message:', payload);

      const notificationTitle = payload.notification?.title || 'LifeDrop Alert';
      const notificationOptions = {
        body: payload.notification?.body || 'You have a new blood request.',
        icon: '/vite.svg',
        badge: '/vite.svg',
        data: payload.data,
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
    });

    console.log('[firebase-messaging-sw.js] Firebase initialized with config from main app.');
  }
});
