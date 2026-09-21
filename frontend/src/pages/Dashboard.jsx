import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Cpu,
  Layers,
  Calendar,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Loader2,
  Sparkles,
  Database,
  Sliders,
  Check
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";
import {
  predictStock,
  getAvailableStocks,
  getStockDetails,
  VERIFIED_EVALUATION_METRICS,
  MODEL_SPECS
} from "../services/api";
import { savePrediction } from "../services/historyService";
import { useAuth } from "../context/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const stockSymbols = useMemo(() => getAvailableStocks(), []);
  
  const [selectedStock, setSelectedStock] = useState("RELIANCE.NS");
  const [searchQuery, setSearchQuery] = useState("");
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionError, setPredictionError] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [saveNotification, setSaveNotification] = useState(null);

  // Filtered stocks based on search query
  const filteredStocks = useMemo(() => {
    if (!searchQuery.trim()) return stockSymbols;
    const q = searchQuery.toLowerCase();
    return stockSymbols.filter((s) => {
      const details = getStockDetails(s);
      return (
        s.toLowerCase().includes(q) ||
        (details?.company && details.company.toLowerCase().includes(q))
      );
    });
  }, [stockSymbols, searchQuery]);

  // Execute LSTM Prediction
  const handleRunPrediction = async () => {
    console.log("[Dashboard] 'Predict Next Price' initiated for stock:", selectedStock);
    setPredictionLoading(true);
    setPredictionResult(null);
    setPredictionError(null);
    setSaveNotification(null);

    try {
      const result = await predictStock(selectedStock);
      setPredictionResult(result);

      // Firestore history saving should happen safely
      // without preventing the loading state from finishing.
      if (user) {
        try {
          await savePrediction({
            userId: user.uid,
            stockName: selectedStock,
            predictionResult: result,
          });
          setSaveNotification({
            type: "auth",
            text: `Prediction saved to ${user.displayName || "account"}'s history.`,
            linkText: "View History",
            linkTo: "/history",
          });
        } catch (historyError) {
          console.error("Firestore history save failed:", historyError);
        }
      } else {
        setSaveNotification({
          type: "guest",
          text: "Prediction generated. Sign in to save forecasts to your private history.",
          linkText: "Sign In",
          linkTo: "/login",
        });
      }
    } catch (error) {
      setPredictionResult(null);
      console.error("Prediction failed:", error);
      setPredictionError(error.message || "Failed to generate prediction. Please try again.");
    } finally {
      setPredictionLoading(false);
    }
  };

  const isUp = predictionResult?.direction === "UP";
  const isDown = predictionResult?.direction === "DOWN";

  const scrollToPrediction = () => {
    document.getElementById("prediction-panel")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="page-container">
      {/* 1. Hero Section */}
      <section style={{ padding: "32px 0 48px" }}>
        <div style={{ maxWidth: "800px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(139, 92, 246, 0.12)",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              padding: "6px 14px",
              borderRadius: "20px",
              marginBottom: "18px",
            }}
          >
            <Sparkles size={14} color="var(--accent-light)" />
            <span style={{ color: "var(--accent-light)", fontWeight: 600, fontSize: "12px", letterSpacing: "0.08em" }}>
              NIFTY 50 STOCK INTELLIGENCE
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 54px)",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: "18px",
            }}
          >
            Predict the next market move.
          </h1>

          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "18px",
              lineHeight: 1.65,
              marginBottom: "28px",
            }}
          >
            This application uses a deep Long Short-Term Memory (LSTM) regression model trained
            on comprehensive historical NIFTY 50 constituent market data. By analyzing 60-day
            sequential patterns across 26 engineered technical indicators, the model computes the
            next predicted closing price for selected equities.
          </p>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
            <button
              id="cta-make-prediction"
              type="button"
              className="btn-primary"
              onClick={scrollToPrediction}
            >
              <span>Make a Prediction</span>
              <ArrowRight size={16} />
            </button>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                borderRadius: "10px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                fontSize: "13px",
                color: "var(--text-secondary)",
              }}
            >
              <CheckCircle2 size={16} color="var(--success)" />
              <span>50 Constituent Scalers Loaded</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Model Overview Card */}
      <section style={{ marginBottom: "36px" }}>
        <div className="card" style={{ position: "relative", overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "rgba(139, 92, 246, 0.15)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--accent-light)",
                }}
              >
                <Cpu size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#fff" }}>
                  Model Architecture & Factual Overview
                </h2>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  Verified deep neural network specifications for time-series forecasting
                </p>
              </div>
            </div>

            <div className="badge-accent">
              <span>Status: Active Inference</span>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "14px",
            }}
          >
            <div style={{ background: "var(--surface-light)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border)" }}>
              <div className="stat-label">Model Type</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff" }}>{MODEL_SPECS.architecture}</div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>Multi-layer recurrent network</div>
            </div>

            <div style={{ background: "var(--surface-light)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border)" }}>
              <div className="stat-label">Sequence Lookback</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--accent-light)" }}>{MODEL_SPECS.lookback}</div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>Temporal sliding window (T-60)</div>
            </div>

            <div style={{ background: "var(--surface-light)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border)" }}>
              <div className="stat-label">Input Features</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--blue)" }}>{MODEL_SPECS.featuresCount} Features</div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>Engineered technical indicators</div>
            </div>

            <div style={{ background: "var(--surface-light)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border)" }}>
              <div className="stat-label">Target Output</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--success)" }}>Next Close (₹)</div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>Next sequential market close</div>
            </div>

            <div style={{ background: "var(--surface-light)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border)" }}>
              <div className="stat-label">Coverage Universe</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff" }}>{MODEL_SPECS.universe}</div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>Constituent blue-chip equities</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Prediction Panel */}
      <section id="prediction-panel" style={{ marginBottom: "36px", scrollMarginTop: "90px" }}>
        <div className="card">
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: "10px" }}>
              <Sliders size={20} color="var(--accent-light)" />
              Stock Prediction Panel
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginTop: "4px" }}>
              Select any NIFTY 50 constituent equity to prepare the 60-day sequence and compute the next closing price.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
              alignItems: "flex-end",
            }}
          >
            {/* Search Input */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
                Filter Symbols
              </label>
              <div style={{ position: "relative" }}>
                <Search
                  size={16}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  id="stock-search-input"
                  type="text"
                  className="input-field"
                  placeholder="Filter stock (e.g. RELIANCE, TCS, INFY)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: "40px" }}
                />
              </div>
            </div>

            {/* Stock Selector Dropdown */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
                Select NIFTY 50 Stock
              </label>
              <select
                id="stock-select"
                className="select-field"
                value={selectedStock}
                onChange={(e) => {
                  setSelectedStock(e.target.value);
                  setPredictionResult(null);
                  setPredictionError(null);
                  setSaveNotification(null);
                }}
              >
                {filteredStocks.map((symbol) => {
                  const details = getStockDetails(symbol);
                  return (
                    <option key={symbol} value={symbol}>
                      {symbol} {details?.company ? `— ${details.company}` : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Prediction Button */}
            <div>
              <button
                id="btn-predict-stock"
                type="button"
                className="btn-primary"
                onClick={handleRunPrediction}
                disabled={predictionLoading}
                style={{ width: "100%", height: "48px" }}
              >
                {predictionLoading ? (
                  <>
                    <Loader2 size={18} className="spinner" />
                    <span>Computing Prediction...</span>
                  </>
                ) : (
                  <>
                    <TrendingUp size={18} />
                    <span>Predict Next Price</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {predictionError && (
            <div className="alert-error" style={{ marginTop: "20px" }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong>Prediction Error:</strong> {predictionError}
                <button
                  type="button"
                  onClick={handleRunPrediction}
                  style={{
                    display: "inline-block",
                    marginLeft: "12px",
                    background: "rgba(255, 255, 255, 0.15)",
                    border: "none",
                    color: "#fff",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Save / Auth Notification */}
          {saveNotification && (
            <div
              className={saveNotification.type === "auth" ? "alert-success" : "alert-info"}
              style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Check size={18} style={{ flexShrink: 0 }} />
                <span>{saveNotification.text}</span>
              </div>
              <Link
                to={saveNotification.linkTo}
                style={{
                  color: "inherit",
                  fontWeight: 700,
                  textDecoration: "underline",
                  fontSize: "13px",
                  whiteSpace: "nowrap",
                }}
              >
                {saveNotification.linkText} &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 4. Prediction Result Section */}
      {predictionResult && (
        <section id="prediction-result" style={{ marginBottom: "36px" }}>
          <div className="stats-grid">
            <div className="stat-item" id="result-stock-info">
              <div className="stat-label">Stock Name</div>
              <div className="stat-value" style={{ fontSize: "24px" }}>
                {predictionResult.stock}
              </div>
              <div className="stat-sub" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Calendar size={13} />
                Latest Date: {predictionResult.latest_date}
              </div>
            </div>

            <div className="stat-item" id="result-latest-close">
              <div className="stat-label">Latest Close Price</div>
              <div className="stat-value">
                ₹{predictionResult.latest_close.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="stat-sub">
                Recorded historical baseline
              </div>
            </div>

            <div
              className="stat-item"
              id="result-predicted-price"
              style={{
                borderColor: isUp ? "rgba(16, 185, 129, 0.4)" : isDown ? "rgba(239, 68, 68, 0.4)" : "var(--border)",
              }}
            >
              <div className="stat-label">Predicted Next Close</div>
              <div
                className="stat-value"
                style={{
                  color: isUp ? "var(--success)" : isDown ? "var(--danger)" : "var(--text-primary)",
                }}
              >
                ₹{predictionResult.predicted_next_price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="stat-sub">
                LSTM regression forward estimate
              </div>
            </div>

            <div className="stat-item" id="result-expected-change">
              <div className="stat-label">Expected Change & Direction</div>
              <div style={{ marginTop: "4px" }}>
                <span className={isUp ? "badge-up" : isDown ? "badge-down" : "badge-neutral"} style={{ fontSize: "14px", padding: "6px 12px" }}>
                  {isUp && <TrendingUp size={16} />}
                  {isDown && <TrendingDown size={16} />}
                  {!isUp && !isDown && <Minus size={16} />}
                  <strong>{predictionResult.direction}</strong>: {predictionResult.expected_change >= 0 ? "+" : ""}
                  {predictionResult.expected_change.toFixed(2)} ({predictionResult.expected_change_percent >= 0 ? "+" : ""}
                  {predictionResult.expected_change_percent.toFixed(2)}%)
                </span>
              </div>
              <div className="stat-sub" style={{ marginTop: "8px" }}>
                Directional price trajectory
              </div>
            </div>
          </div>

          {/* Sequential Evaluation Chart */}
          {predictionResult.chart_points && predictionResult.chart_points.length > 0 && (
            <div className="card" style={{ marginTop: "24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
                    <BarChart3 size={18} color="var(--accent-light)" />
                    {predictionResult.stock} — Historical vs. LSTM Predicted Sequence
                  </h3>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
                    Comparison of actual closing prices with LSTM sequential predictions over the evaluation period
                  </p>
                </div>
              </div>

              <div style={{ width: "100%", height: "340px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={predictionResult.chart_points} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                    <YAxis
                      stroke="var(--text-muted)"
                      fontSize={12}
                      tickLine={false}
                      domain={["auto", "auto"]}
                      tickFormatter={(val) => `₹${val}`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#0e1320",
                        borderColor: "rgba(255,255,255,0.12)",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "13px",
                      }}
                      formatter={(value) => [`₹${Number(value).toFixed(2)}`, undefined]}
                    />
                    <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "13px" }} />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      name="Actual Close"
                      stroke="#8b5cf6"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: "#8b5cf6" }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      name="LSTM Predicted"
                      stroke="#10b981"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ r: 3, fill: "#10b981" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 5. Model Performance Section */}
      <section style={{ marginBottom: "36px" }}>
        <div className="card">
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Database size={18} color="var(--accent-light)" />
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#fff" }}>
                Model Performance & Evaluation Metrics
              </h2>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
              Verified quantitative evaluation metrics calculated across the complete test dataset for the trained LSTM regression model.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            <div className="stat-item">
              <div className="stat-label">Mean Absolute Error (MAE)</div>
              <div className="stat-value" style={{ color: "var(--accent-light)" }}>
                {VERIFIED_EVALUATION_METRICS.mae}
              </div>
              <div className="stat-sub">
                Average absolute difference between actual and predicted prices
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-label">Mean Squared Error (MSE)</div>
              <div className="stat-value" style={{ color: "var(--blue)" }}>
                {VERIFIED_EVALUATION_METRICS.mse.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
              <div className="stat-sub">
                Squared penalty metric capturing variance of errors
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-label">Root Mean Squared Error (RMSE)</div>
              <div className="stat-value" style={{ color: "var(--warning)" }}>
                {VERIFIED_EVALUATION_METRICS.rmse}
              </div>
              <div className="stat-sub">
                Error magnitude measured directly in rupee currency units
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-label">Coefficient of Determination (R²)</div>
              <div className="stat-value" style={{ color: "var(--success)" }}>
                {VERIFIED_EVALUATION_METRICS.r2}
              </div>
              <div className="stat-sub">
                97.14% of price variance explained by the model
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Feature & Model Information */}
      <section style={{ marginBottom: "20px" }}>
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Layers size={18} color="var(--accent-light)" />
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#fff" }}>
              Feature Engineering & Technical Indicators
            </h2>
          </div>

          <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>
            The LSTM model utilizes 26 engineered market features generated from raw historical price
            series. Each stock’s feature matrix is scaled using individual per-stock StandardScalers,
            preserving local distributions while preventing cross-stock data leakage.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
            }}
          >
            <div style={{ background: "var(--surface-light)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border)" }}>
              <div style={{ fontWeight: 600, color: "#fff", marginBottom: "8px", fontSize: "14px" }}>
                Price & Spread Dynamics
              </div>
              <ul style={{ paddingLeft: "20px", color: "var(--text-secondary)", fontSize: "13px", lineHeight: 1.7 }}>
                <li>OHLCV Data (Open, High, Low, Close, Volume)</li>
                <li>Daily Return & Percentage Change</li>
                <li>Price Change (Close - Open)</li>
                <li>High-Low Spread & Open-Close Spread</li>
              </ul>
            </div>

            <div style={{ background: "var(--surface-light)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border)" }}>
              <div style={{ fontWeight: 600, color: "#fff", marginBottom: "8px", fontSize: "14px" }}>
                Trend & Momentum Oscillators
              </div>
              <ul style={{ paddingLeft: "20px", color: "var(--text-secondary)", fontSize: "13px", lineHeight: 1.7 }}>
                <li>Moving Averages: MA5, MA10, MA20, MA50</li>
                <li>Relative Strength Index (RSI 14)</li>
                <li>MACD (Moving Average Convergence Divergence)</li>
                <li>MACD Signal & Divergence Histogram</li>
              </ul>
            </div>

            <div style={{ background: "var(--surface-light)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border)" }}>
              <div style={{ fontWeight: 600, color: "#fff", marginBottom: "8px", fontSize: "14px" }}>
                Volatility & Temporal Lags
              </div>
              <ul style={{ paddingLeft: "20px", color: "var(--text-secondary)", fontSize: "13px", lineHeight: 1.7 }}>
                <li>Rolling Volatility (5-day & 20-day standard dev)</li>
                <li>Volume Features (Volume MA10 & Volume Ratios)</li>
                <li>Lagged Closing Prices (Lag 1, Lag 2, Lag 3, Lag 5)</li>
                <li>Chronological Train/Test Partitioning</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
