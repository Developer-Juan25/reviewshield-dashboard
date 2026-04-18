import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC8z8Kjj86HyJGr7Nid8MKdGykDiOipBBs",
  authDomain: "reviewshield-84c6c.firebaseapp.com",
  projectId: "reviewshield-84c6c",
  storageBucket: "reviewshield-84c6c.firebasestorage.app",
  messagingSenderId: "947092276397",
  appId: "1:947092276397:web:f09f523fbb84b3a8467224",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
