import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBGgiAIAJbV16KnyKxznpYKStJzpsFvQZ4',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'bicc-gambia.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'bicc-gambia',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'bicc-gambia.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '558764119624',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:558764119624:web:09c83f8b7e4a243f17ea7d',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export function getSecondaryAdminApp() {
  const existing = getApps().find((entry) => entry.name === 'admin-user-manager');
  return existing || initializeApp(firebaseConfig, 'admin-user-manager');
}

export function getSecondaryAdminAuth() {
  return getAuth(getSecondaryAdminApp());
}

export default app;
