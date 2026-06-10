importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

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
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/pupa-icon.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});