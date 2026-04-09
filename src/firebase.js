import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { initializeFirestore, connectFirestoreEmulator } from "firebase/firestore";

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

// Connect to Emulators in Development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.info('🛠️ EVENTIFY: Development Mode Detected. Connecting to Local Emulators...');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, "http://localhost:9099");
}

export default app;
