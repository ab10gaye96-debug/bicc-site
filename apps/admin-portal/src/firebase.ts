import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: "AIzaSyBGgiAIAJbV16KnyKxznpYKStJzpsFvQZ4",
  authDomain: "bicc-gambia.firebaseapp.com",
  projectId: "bicc-gambia",
  storageBucket: "bicc-gambia.appspot.com",
  messagingSenderId: "558764119624",
  appId: "1:558764119624:web:09c83f8b7e4a243f17ea7d"
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
