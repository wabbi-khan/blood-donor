// ╔══════════════════════════════════════════╗
// ║  LifeDrop — Firebase Configuration          ║
// ╚══════════════════════════════════════════╝
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getMessaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDI7BSmsQEKs0W2uRXiCX6yBspPFkiahdQ",
  authDomain: "blood-donor-30e89.firebaseapp.com",
  databaseURL: "https://blood-donor-30e89-default-rtdb.firebaseio.com",
  projectId: "blood-donor-30e89",
  storageBucket: "blood-donor-30e89.firebasestorage.app",
  messagingSenderId: "905497104922",
  appId: "1:905497104922:web:cb0ce26083e614ac89f7a3",
  measurementId: "G-J0TR6VB5GD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth — Email/Password (no SMS)
export const auth = getAuth(app);

// Firestore — Main database
export const db = getFirestore(app);

// Realtime Database — Live tracking
export const rtdb = getDatabase(app);

// FCM — Push Notifications (async: only in supported browsers)
export const getMessagingInstance = async () => {
  const supported = await isSupported();
  if (supported) {
    return getMessaging(app);
  }
  return null;
};

export default app;
