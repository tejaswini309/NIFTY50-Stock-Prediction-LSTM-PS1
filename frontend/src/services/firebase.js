import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.apiKey !== "your_api_key_here" &&
    firebaseConfig.apiKey.trim().length > 0
  );
};

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.warn("Firebase initialization skipped or encountered error:", err);
  }
}

/**
 * Format Firebase Auth errors into clear, actionable human-readable messages
 */
export function formatAuthError(error) {
  if (!error) return "An unexpected error occurred.";
  const code = error.code || "";
  switch (code) {
    case "auth/invalid-email":
      return "The email address is invalid.";
    case "auth/user-disabled":
      return "This user account has been disabled.";
    case "auth/user-not-found":
      return "No account found with this email. Please sign up first.";
    case "auth/wrong-password":
      return "Incorrect password. Please verify and try again.";
    case "auth/invalid-credential":
      return "Invalid email or password. Please try again.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Please log in instead.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "Google sign-in popup was closed before completing.";
    case "auth/popup-blocked":
      return "Popup was blocked by your browser. Please allow popups for this site.";
    case "auth/cancelled-popup-request":
      return "The sign-in popup request was cancelled.";
    case "auth/operation-not-allowed":
      return "This authentication provider is not enabled in the Firebase Console.";
    case "auth/network-request-failed":
      return "Network connection issue. Please check your internet connection.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please wait a few minutes before trying again.";
    default:
      return error.message || "Authentication failed. Please try again.";
  }
}

export { app, auth, db };
