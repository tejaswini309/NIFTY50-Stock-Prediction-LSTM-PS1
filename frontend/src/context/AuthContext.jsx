import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContextInstance";
import { auth, isFirebaseConfigured, formatAuthError } from "../services/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const LOCAL_USER_KEY = "nifty50_auth_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // If Firebase is configured, wait for onAuthStateChanged to resolve live user
    if (isFirebaseConfigured()) return null;
    try {
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(() => isFirebaseConfigured());
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // If live Firebase is configured, listen to onAuthStateChanged
    if (isFirebaseConfigured() && auth) {
      const unsubscribe = onAuthStateChanged(
        auth,
        (firebaseUser) => {
          if (firebaseUser) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split("@")[0] : "Trader"),
              photoURL: firebaseUser.photoURL,
              emailVerified: firebaseUser.emailVerified,
              isAnonymous: firebaseUser.isAnonymous,
              provider: firebaseUser.providerData?.[0]?.providerId || "firebase",
              metadata: {
                creationTime: firebaseUser.metadata?.creationTime,
                lastSignInTime: firebaseUser.metadata?.lastSignInTime,
              },
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        },
        (error) => {
          console.warn("Firebase auth state listener warning:", error);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    }
  }, []);

  // Sign In with Email & Password
  const signInWithEmail = async (email, password) => {
    setLoading(true);
    setAuthError(null);

    const cleanEmail = (email || "").trim();
    if (!cleanEmail) {
      const msg = "Please provide a valid email address.";
      setAuthError(msg);
      setLoading(false);
      throw new Error(msg);
    }
    if (!password) {
      const msg = "Please enter your password.";
      setAuthError(msg);
      setLoading(false);
      throw new Error(msg);
    }

    if (isFirebaseConfigured() && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const u = userCredential.user;
        const normalized = {
          uid: u.uid,
          email: u.email,
          displayName: u.displayName || cleanEmail.split("@")[0],
          photoURL: u.photoURL,
          emailVerified: u.emailVerified,
          isAnonymous: u.isAnonymous,
          provider: u.providerData?.[0]?.providerId || "password",
          metadata: {
            creationTime: u.metadata?.creationTime,
            lastSignInTime: u.metadata?.lastSignInTime,
          },
        };
        setUser(normalized);
        setLoading(false);
        return normalized;
      } catch (err) {
        const friendlyMessage = formatAuthError(err);
        setAuthError(friendlyMessage);
        setLoading(false);
        throw new Error(friendlyMessage);
      }
    }

    // Unconfigured Firebase Demo/Local Session
    await new Promise((resolve) => setTimeout(resolve, 350));
    const localUser = {
      uid: "local_" + btoa(cleanEmail).replace(/=/g, "").slice(0, 12),
      email: cleanEmail,
      displayName: cleanEmail.split("@")[0],
      emailVerified: true,
      isAnonymous: false,
      provider: "email/password",
      metadata: {
        creationTime: new Date().toISOString(),
        lastSignInTime: new Date().toISOString(),
      },
    };
    setUser(localUser);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
    setLoading(false);
    return localUser;
  };

  // Sign Up with Email & Password
  const signUpWithEmail = async (email, password, confirmPassword) => {
    setLoading(true);
    setAuthError(null);

    const cleanEmail = (email || "").trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      const msg = "Please enter a valid email address.";
      setAuthError(msg);
      setLoading(false);
      throw new Error(msg);
    }
    if (!password || password.length < 6) {
      const msg = "Password must be at least 6 characters long.";
      setAuthError(msg);
      setLoading(false);
      throw new Error(msg);
    }
    if (confirmPassword !== undefined && password !== confirmPassword) {
      const msg = "Passwords do not match. Please re-enter.";
      setAuthError(msg);
      setLoading(false);
      throw new Error(msg);
    }

    if (isFirebaseConfigured() && auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        const u = userCredential.user;
        const normalized = {
          uid: u.uid,
          email: u.email,
          displayName: cleanEmail.split("@")[0],
          photoURL: null,
          emailVerified: u.emailVerified,
          isAnonymous: false,
          provider: "password",
          metadata: {
            creationTime: u.metadata?.creationTime,
            lastSignInTime: u.metadata?.lastSignInTime,
          },
        };
        setUser(normalized);
        setLoading(false);
        return normalized;
      } catch (err) {
        const friendlyMessage = formatAuthError(err);
        setAuthError(friendlyMessage);
        setLoading(false);
        throw new Error(friendlyMessage);
      }
    }

    // Unconfigured Firebase Demo/Local Session
    await new Promise((resolve) => setTimeout(resolve, 350));
    const localUser = {
      uid: "local_" + btoa(cleanEmail).replace(/=/g, "").slice(0, 12),
      email: cleanEmail,
      displayName: cleanEmail.split("@")[0],
      emailVerified: true,
      isAnonymous: false,
      provider: "email/password",
      metadata: {
        creationTime: new Date().toISOString(),
        lastSignInTime: new Date().toISOString(),
      },
    };
    setUser(localUser);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
    setLoading(false);
    return localUser;
  };

  // Sign In with Google
  const signInWithGoogle = async () => {
    setLoading(true);
    setAuthError(null);

    if (isFirebaseConfigured() && auth) {
      try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        const result = await signInWithPopup(auth, provider);
        const u = result.user;
        const normalized = {
          uid: u.uid,
          email: u.email,
          displayName: u.displayName || (u.email ? u.email.split("@")[0] : "Google User"),
          photoURL: u.photoURL,
          emailVerified: u.emailVerified,
          isAnonymous: false,
          provider: "google.com",
          metadata: {
            creationTime: u.metadata?.creationTime,
            lastSignInTime: u.metadata?.lastSignInTime,
          },
        };
        setUser(normalized);
        setLoading(false);
        return normalized;
      } catch (err) {
        const friendlyMessage = formatAuthError(err);
        setAuthError(friendlyMessage);
        setLoading(false);
        throw new Error(friendlyMessage);
      }
    }

    // Demo/Local Google Sign-In Fallback
    await new Promise((resolve) => setTimeout(resolve, 350));
    const demoGoogleUser = {
      uid: "google_demo_108291839218",
      email: "trader.nifty@gmail.com",
      displayName: "NIFTY Trader",
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      emailVerified: true,
      isAnonymous: false,
      provider: "google.com",
      metadata: {
        creationTime: new Date().toISOString(),
        lastSignInTime: new Date().toISOString(),
      },
    };
    setUser(demoGoogleUser);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(demoGoogleUser));
    setLoading(false);
    return demoGoogleUser;
  };

  // Sign Out
  const signOutUser = async () => {
    setLoading(true);
    setAuthError(null);
    if (isFirebaseConfigured() && auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn("Firebase sign out warning:", err);
      }
    }
    localStorage.removeItem(LOCAL_USER_KEY);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        setAuthError,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOutUser,
        isFirebaseActive: isFirebaseConfigured(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
