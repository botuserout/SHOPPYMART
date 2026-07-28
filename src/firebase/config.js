import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDsbqzDjjp0A_ZWJgyIHp0W6dsjZHYHd7I",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "shoppymart-c8c0c.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "shoppymart-c8c0c",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "shoppymart-c8c0c.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "405529861818",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:405529861818:web:5347bc157002c7aa896c83",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-0HBF6WE1EH"
};

export const isFirebaseConfigured = true;

// Singleton Firebase App Initialization
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Singleton Auth Instance
export const auth = getAuth(app);

// Singleton Firestore Instance configured with long-polling to prevent WebChannel socket stream blocking by ad-blockers (ERR_BLOCKED_BY_CLIENT)
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});

// Singleton Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;
