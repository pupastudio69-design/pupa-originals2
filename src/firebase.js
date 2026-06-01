import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCvjkGhII9-tSLUjH75BYt1zfAHUL2ta40",
  authDomain: "pupa-originals-31f58.firebaseapp.com",
  projectId: "pupa-originals-31f58",
  storageBucket: "pupa-originals-31f58.firebasestorage.app",
  messagingSenderId: "1012929638279",
  appId: "1:1012929638279:web:dbeafd135dda3b660fed22",
  measurementId: "G-KTZV5BSP3G"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);