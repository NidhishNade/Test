import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCuMxSS3H91roHp5gvWoZW1dYxZ5KhXFeA",
  authDomain: "scan-and-go-free-777.firebaseapp.com",
  projectId: "scan-and-go-free-777",
  storageBucket: "scan-and-go-free-777.firebasestorage.app",
  messagingSenderId: "190785361326",
  appId: "1:190785361326:web:6c568dabf03626970aa43f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services with Connectivity Fixes
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export default app;
