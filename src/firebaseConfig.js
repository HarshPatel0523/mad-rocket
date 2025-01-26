import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5VuPw0WOsXqhA5SMcSzdSy8Td-vFXbps",
  authDomain: "madrocket-8b7c0.firebaseapp.com",
  databaseURL: "https://madrocket-8b7c0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "madrocket-8b7c0",
  storageBucket: "madrocket-8b7c0.firebasestorage.app",
  messagingSenderId: "229314601763",
  appId: "1:229314601763:web:1eed6c9e41ed957cf3e296",
  measurementId: "G-4KBP056BF9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);