// Firebase configuration and initialization
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC1kVpiaC5nJgnAyG8iYO2fsjeYwp35fJ0",
  authDomain: "romance-canvas.firebaseapp.com",
  projectId: "romance-canvas",
  storageBucket: "romance-canvas.firebasestorage.app",
  messagingSenderId: "299645987783",
  appId: "1:299645987783:web:f1ae149e10faf3eedd07e2",
};

// Debug logs to check environment variables
console.log("Firebase Config Debug:");
console.log("API Key:", firebaseConfig.apiKey);
console.log("Auth Domain:", firebaseConfig.authDomain);
console.log("Project ID:", firebaseConfig.projectId);
console.log("Storage Bucket:", firebaseConfig.storageBucket);
console.log("Messaging Sender ID:", firebaseConfig.messagingSenderId);
console.log("App ID:", firebaseConfig.appId);
console.log("Full Config:", firebaseConfig);

// Initialize Firebase (avoid multiple instances)
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export { auth, googleProvider, EmailAuthProvider };
export default app;
