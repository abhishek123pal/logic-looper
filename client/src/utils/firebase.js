import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics"; // ✅ isSupported add kiya
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

const firebaseConfig = {
  // Aapka config yahan rahega
   apiKey: "AIzaSyD1wZaHdequY7-WGP4u47sbERphbfUsKrU",

  authDomain: "project-b9198fd5-2fa0-4c82-9b3.firebaseapp.com",

  projectId: "project-b9198fd5-2fa0-4c82-9b3",

  storageBucket: "project-b9198fd5-2fa0-4c82-9b3.firebasestorage.app",

  messagingSenderId: "1067487116185",

  appId: "1:1067487116185:web:803142af146289eb23f108",

  measurementId: "G-EE5K5BSJXL"
};

// 1. Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. Analytics Guard (Offline/PWA Safety)
let analytics = null;
// isSupported() check karta hai ki kya browser analytics support karta hai (PWA environments mein safe hai)
isSupported().then((supported) => {
  if (supported && navigator.onLine) {
    analytics = getAnalytics(app);
  }
}).catch(() => {
  console.log("Analytics not available - Offline mode");
});

// 3. Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Named exports
export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  analytics // analytics bhi export kar diya agar kahin use karna ho
};