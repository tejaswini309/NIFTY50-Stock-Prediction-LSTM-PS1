import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  History,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Trash2,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { getUserPredictions, deleteUserPrediction, clearUserPredictions } from "../services/historyService";
import { useAuth } from "../context/useAuth";

export default function PredictionHistory() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusMessage, setStatusMessage] = useState(null);

  const refreshHistory = useCallback(async () => {
    if (!user?.uid) {
      setRecords([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getUserPredictions(user.uid);
      setRecords(data || []);
    } catch (err) {
      console.error("Failed to load user predictions:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    if (!user?.uid) {
      Promise.resolve().then(() => {
        if (isMounted) {
          setRecords([]);
          setLoading(false);
        }
      });
      return () => {
        isMounted = false;
      };
    }

    getUserPredictions(user.uid)
      .then((data) => {
        if (isMounted) {
          setRecords(data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load user predictions:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleDelete = async (recordId) => {
    if (!user?.uid) return;
    const ok = await deleteUserPrediction(user.uid, recordId);
    if (ok) {
      setRecords((prev) => prev.filter((r) => r.id !== recordId));
      setStatusMessage("Record removed from history.");
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleClearAll = async () => {
    if (!user?.uid || records.length === 0) return;
    if (window.confirm("Are you sure you want to clear your entire prediction history?")) {
      await clearUserPredictions(user.uid);
      setRecords([]);
      setStatusMessage("All prediction records cleared.");
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records;
    const q = searchQuery.toLowerCase();
    return records.filter((rec) => {
      const stock = rec.outputData?.stock || rec.inputData?.stock_name || "";
      return stock.toLowerCase().includes(q);
    });
  }, [records, searchQuery]);

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "32px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
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
              <History size={20} />
            </div>
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#fff" }}>
              Prediction History
            </h1>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
            Review authenticated LSTM prediction records generated during your sessions.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={refreshHistory}
            title="Refresh records"
          >
            <RefreshCw size={15} />
            <span>Refresh</span>
          </button>

          {records.length > 0 && (
            <button
              type="button"
              className="btn-ghost"
              onClick={handleClearAll}
              style={{ color: "var(--danger)" }}
            >
              <Trash2 size={15} />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Account Info Pill */}
      <div
        className="card"
        style={{
          marginBottom: "24px",
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <ShieldCheck size={18} color="var(--accent-light)" />
          <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            History bound to user: <strong>{user?.displayName || "Guest User"}</strong> ({user?.email || "Local session"})
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-muted)" }}>
          <span>Total Predictions: <strong>{records.length}</strong></span>
        </div>
      </div>

      {statusMessage && (
        <div className="alert-info" style={{ marginBottom: "20px" }}>
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <div className="card" style={{ textAlign: "center", padding: "60px 20px" }}>
          <RefreshCw size={24} className="spinner" style={{ color: "var(--accent-light)", margin: "0 auto 16px" }} />
          <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>Loading prediction records...</p>
        </div>
      ) : records.length === 0 ? (
        /* Empty State (Notice: No fake historical records are created) */
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "64px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "rgba(139, 92, 246, 0.12)",
              border: "1px solid rgba(139, 92, 246, 0.25)",
              display: "grid",
              placeItems: "center",
              color: "var(--accent-light)",
              marginBottom: "20px",
            }}
          >
            <History size={30} />
          </div>

          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
            No prediction records yet
          </h2>

          <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, marginBottom: "24px" }}>
            You haven't run any stock predictions in this session. Each time you execute a forecast on the
            Dashboard, the output data, timestamps, and predicted values will be securely logged here.
          </p>

          <Link to="/" style={{ textDecoration: "none" }}>
            <button type="button" className="btn-primary">
              <Sparkles size={16} />
              <span>Go to Dashboard to Predict</span>
            </button>
          </Link>
        </div>
      ) : (
        /* Table of Real User Predictions */
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ position: "relative", minWidth: "260px" }}>
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
                type="text"
                className="input-field"
                placeholder="Filter history by stock symbol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: "40px", paddingRight: "14px", height: "40px", fontSize: "13px" }}
              />
            </div>

            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Showing {filteredRecords.length} of {records.length} records
            </span>
          </div>

          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Stock</th>
                  <th>Prediction Date / Time</th>
                  <th>Latest Close</th>
                  <th>Predicted Price</th>
                  <th>Expected Change</th>
                  <th>Expected Change %</th>
                  <th>Direction</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => {
                  const out = record.outputData || {};
                  const stockSymbol = out.stock || record.inputData?.stock_name || "N/A";
                  const isUp = out.direction === "UP";
                  const isDown = out.direction === "DOWN";
                  const dateFormatted = record.createdAt
                    ? new Date(record.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A";

                  return (
                    <tr key={record.id}>
                      <td style={{ fontWeight: 700, color: "var(--accent-light)" }}>
                        {stockSymbol}
                      </td>

                      <td style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Calendar size={13} />
                          {dateFormatted}
                        </div>
                      </td>

                      <td>
                        ₹{Number(out.latest_close || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>

                      <td style={{ fontWeight: 700, color: isUp ? "var(--success)" : isDown ? "var(--danger)" : "var(--text-primary)" }}>
                        ₹{Number(out.predicted_next_price || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>

                      <td style={{ color: isUp ? "var(--success)" : isDown ? "var(--danger)" : "var(--text-secondary)" }}>
                        {Number(out.expected_change) >= 0 ? "+" : ""}
                        {Number(out.expected_change || 0).toFixed(2)}
                      </td>

                      <td style={{ color: isUp ? "var(--success)" : isDown ? "var(--danger)" : "var(--text-secondary)" }}>
                        {Number(out.expected_change_percent) >= 0 ? "+" : ""}
                        {Number(out.expected_change_percent || 0).toFixed(2)}%
                      </td>

                      <td>
                        <span className={isUp ? "badge-up" : isDown ? "badge-down" : "badge-neutral"}>
                          {isUp && <TrendingUp size={12} />}
                          {isDown && <TrendingDown size={12} />}
                          {!isUp && !isDown && <Minus size={12} />}
                          {out.direction || "NEUTRAL"}
                        </span>
                      </td>

                      <td>
                        <span className="badge-accent" style={{ fontSize: "12px", padding: "2px 8px" }}>
                          {record.status || "Completed"}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Link
                            to="/"
                            title="Inspect in Dashboard"
                            style={{ color: "var(--text-secondary)", textDecoration: "none" }}
                          >
                            <ExternalLink size={15} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(record.id)}
                            className="btn-ghost"
                            style={{ padding: "4px", color: "var(--text-muted)" }}
                            title="Delete this record"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
