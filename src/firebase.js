import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyB2JLL58U7ZEKEx4GiDdCWTFNrLg3F-Of8",
  authDomain: "pupa-originals-new.firebaseapp.com",
  projectId: "pupa-originals-new",
  storageBucket: "pupa-originals-new.firebasestorage.app",
  messagingSenderId: "981860483022",
  appId: "1:981860483022:web:eb4dfc8f5378e61890b59f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);
export { app };