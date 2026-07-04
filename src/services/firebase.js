// ╔══════════════════════════════════════════╗
// ║  LifeDrop — Firebase Configuration          ║
// ╚══════════════════════════════════════════╝
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getMessaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
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

export const requestFCMToken = async () => {
  try {
    const messaging = await getMessagingInstance();
    if (!messaging) return null;
    
    // The browser will ask the user for permission if not already granted.
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const { getToken } = await import('firebase/messaging');
      // Replace with your VAPID key if you have generated one in Firebase Console > Project Settings > Cloud Messaging
      const currentToken = await getToken(messaging);
      return currentToken;
    }
  } catch (error) {
    console.warn("An error occurred while retrieving token. ", error);
  }
  return null;
};

export default app;
