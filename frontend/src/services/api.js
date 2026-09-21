import axios from "axios";
import stocksData from "../data/stocksData.json";

// The deployed Render FastAPI prediction backend
export const PRODUCTION_API_URL = "https://nifty50-stock-prediction-lstm-ps1.onrender.com/predict";
export const PREVIEW_API_URL = "/api/predict";

// Environment-aware API configuration:
// - AI Studio / Vite preview uses "/api/predict" (proxied through Vite to Render to avoid browser CORS preflight issues)
// - Production frontend can use "https://nifty50-stock-prediction-lstm-ps1.onrender.com/predict"
const isPreview =
  import.meta.env.DEV ||
  (typeof window !== "undefined" && window.location.hostname.includes("run.app")) ||
  import.meta.env.VITE_USE_PROXY === "true";

export const PREDICT_ENDPOINT = isPreview
  ? PREVIEW_API_URL
  : (import.meta.env.VITE_API_BASE_URL
      ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "")}/predict`
      : PRODUCTION_API_URL);

export const API_BASE_URL = isPreview
  ? "/api"
  : (import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "")
      : "https://nifty50-stock-prediction-lstm-ps1.onrender.com");

export const apiClient = axios.create({
  timeout: 180000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Predict next closing price for a selected NIFTY 50 stock.
 *
 * Calls:
 * POST https://nifty50-stock-prediction-lstm-ps1.onrender.com/predict
 *
 * Body:
 * {
 *   "stock_name": "RELIANCE.NS"
 * }
 *
 * The deployed Render FastAPI backend is the only source of prediction results.
 * No prediction fallbacks or precomputed predictions are used.
 */
export async function predictStock(stockName) {
  const normalizedStock = stockName ? stockName.trim() : "RELIANCE.NS";
  const url = PREDICT_ENDPOINT;

  console.log("Prediction request started", normalizedStock);
  console.log("Prediction API URL", url);

  try {
    const response = await apiClient.post(
      url,
      {
        stock_name: normalizedStock,
      },
      {
        timeout: 180000,
      }
    );

    console.log("Prediction response", response.data);

    const data = response.data;

    if (!data) {
      throw new Error("Empty response received from prediction API.");
    }

    const direction =
      data.direction ||
      data.prediction_direction ||
      (Number(data.expected_change) >= 0 ? "UP" : "DOWN");

    return {
      stock: data.stock || data.stock_name || normalizedStock,
      latest_date: data.latest_date,
      latest_close: Number(data.latest_close),
      predicted_next_price: Number(data.predicted_next_price),
      expected_change: Number(data.expected_change),
      expected_change_percent: Number(data.expected_change_percent),
      direction: String(direction).toUpperCase(),
      chart_points: Array.isArray(data.chart_points) ? data.chart_points : [],
    };
  } catch (error) {
    console.error("Prediction request failed", error);

    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }

    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      throw new Error(
        "Prediction request timed out after 180 seconds. The backend on Render is likely cold-starting; please retry shortly."
      );
    }

    if (error.code === "ERR_NETWORK") {
      throw new Error(
        `Unable to connect to prediction API at ${url}. Check CORS or backend connectivity.`
      );
    }

    throw new Error(error.message || "Prediction service request failed.");
  }
}

/**
 * Verified model evaluation constants from the trained model.
 */
export const VERIFIED_EVALUATION_METRICS = {
  mae: 192.57,
  mse: 219367.12,
  rmse: 468.37,
  r2: 0.9714,
};

/**
 * Model specification constants.
 */
export const MODEL_SPECS = {
  architecture: "LSTM Regression",
  lookback: "60 time steps",
  featuresCount: 26,
  target: "Next Closing Price",
  universe: "50 NIFTY 50 Stocks",
  scaling: "Per-stock StandardScaler",
};

/**
 * Returns the list of all supported NIFTY 50 stock symbols.
 */
export function getAvailableStocks() {
  return Object.keys(stocksData.stocks).sort();
}

/**
 * Retrieves stock details from the dataset.
 */
export function getStockDetails(symbol) {
  return stocksData.stocks[symbol] || null;
}
