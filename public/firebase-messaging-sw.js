importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB2JLL58U7ZEKEx4GiDdCWTFNrLg3F-Of8",
  authDomain: "pupa-originals-new.firebaseapp.com",
  projectId: "pupa-originals-new",
  storageBucket: "pupa-originals-new.firebasestorage.app",
  messagingSenderId: "981860483022",
  appId: "1:981860483022:web:eb4dfc8f5378e61890b59f"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/pupa-icon.png',
    badge: '/pupa-icon.png',
    tag: payload.notification.tag || 'pupa-notification',
    requireInteraction: false,
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      if (clientList.length > 0) {
        clientList[0].focus();
      } else {
        clients.openWindow('/');
      }
    })
  );
});
