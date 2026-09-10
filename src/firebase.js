import { initializeApp } from "firebase/app";
import { initializeAuth, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2Od_TX_Qaqar5lkZOzWQ_fFPfmkQXo1w",
  authDomain: "saheli-network-b633f.firebaseapp.com",
  projectId: "saheli-network-b633f",
  storageBucket: "saheli-network-b633f.firebasestorage.app",
  messagingSenderId: "375157920247",
  appId: "1:375157920247:web:4d5b084ca78ea0b2cbdef2"
};

const app = initializeApp(firebaseConfig);

// Keep login across refreshes, but only for the current tab session.
export const auth = initializeAuth(app, {
  persistence: browserSessionPersistence,
});
export const db = getFirestore(app);
