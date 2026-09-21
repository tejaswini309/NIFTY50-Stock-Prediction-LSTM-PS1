import { db, isFirebaseConfigured } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc
} from "firebase/firestore";

const STORAGE_KEY_PREFIX = "nifty50_predictions_";

/**
 * Saves a prediction record for a specific user
 */
export async function savePrediction(arg) {
  // Support both savePrediction(result) and savePrediction({ userId, stockName, predictionResult })
  const isDirectResult = arg && (arg.stock || arg.predicted_next_price);
  const userId = isDirectResult ? (arg.userId || null) : (arg?.userId || null);
  const stockName = isDirectResult ? (arg.stock || "") : (arg?.stockName || arg?.predictionResult?.stock || "");
  const predictionResult = isDirectResult ? arg : (arg?.predictionResult || null);

  if (!predictionResult) return null;

  const recordPayload = {
    userId: userId || "anonymous",
    modelId: "lstm_regression_nifty50",
    modelName: "LSTM Regression",
    inputData: {
      stock_name: stockName,
    },
    outputData: {
      stock: predictionResult.stock,
      latest_date: predictionResult.latest_date,
      latest_close: predictionResult.latest_close,
      predicted_next_price: predictionResult.predicted_next_price,
      expected_change: predictionResult.expected_change,
      expected_change_percent: predictionResult.expected_change_percent,
      direction: predictionResult.direction,
    },
    status: "Completed",
    createdAt: new Date().toISOString(),
  };

  // Try saving to Firebase Firestore if configured with a 3-second timeout to prevent hanging
  if (isFirebaseConfigured() && db && userId) {
    try {
      const savePromise = addDoc(collection(db, "predictions"), {
        ...recordPayload,
        createdAt: serverTimestamp(),
      });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore write timeout")), 3000)
      );
      const docRef = await Promise.race([savePromise, timeoutPromise]);
      return { id: docRef.id, ...recordPayload };
    } catch (err) {
      console.warn("Firestore save failed or timed out, falling back to local user store:", err.message);
    }
  }

  // Fallback to local storage scoped strictly to userId
  if (!userId) return recordPayload;
  const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
  try {
    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const localRecord = {
      id: "pred_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6),
      ...recordPayload,
    };
    const updated = [localRecord, ...existing];
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return localRecord;
  } catch (err) {
    console.error("Local storage error:", err);
    return null;
  }
}

/**
 * Fetches prediction records for a specific user.
 * Users must only be able to access their own prediction history.
 * No fake records are returned.
 */
export async function getUserPredictions(userId) {
  if (!userId) return [];

  // 1. If Firebase is configured, fetch from Firestore
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(
        collection(db, "predictions"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const records = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        let dateStr = new Date().toISOString();
        if (data.createdAt && typeof data.createdAt.toDate === "function") {
          dateStr = data.createdAt.toDate().toISOString();
        } else if (data.createdAt) {
          dateStr = data.createdAt;
        }

        records.push({
          id: docSnap.id,
          ...data,
          createdAt: dateStr,
        });
      });
      return records;
    } catch (err) {
      console.warn("Firestore fetch failed or permission denied, using local storage:", err.message);
    }
  }

  // 2. Read from local storage scoped strictly to userId
  const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
  try {
    const records = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return records;
  } catch {
    return [];
  }
}

/**
 * Deletes a single prediction record for a user
 */
export async function deleteUserPrediction(userId, recordId) {
  if (!userId || !recordId) return false;

  if (isFirebaseConfigured() && db) {
    try {
      await deleteDoc(doc(db, "predictions", recordId));
    } catch (err) {
      console.warn("Firestore delete failed:", err);
    }
  }

  const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
  try {
    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const updated = existing.filter((item) => item.id !== recordId);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
}

/**
 * Clears all predictions for a specific user
 */
export async function clearUserPredictions(userId) {
  if (!userId) return;
  const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
  localStorage.removeItem(storageKey);
}
