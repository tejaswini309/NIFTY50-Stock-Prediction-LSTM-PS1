import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Lock,
  Cpu,
  Database
} from "lucide-react";
import { useAuth } from "../context/useAuth";

export default function Account() {
  const { user, signOutUser, isFirebaseActive } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSignOut = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await signOutUser();
      navigate("/login", { replace: true });
    } catch (err) {
      setErrorMessage(err.message || "Failed to sign out.");
      setLoading(false);
    }
  };

  const getInitials = (name, email) => {
    if (name) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return name.slice(0, 2).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return "TR";
  };

  return (
    <div className="page-container" style={{ maxWidth: "800px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
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
            <User size={20} />
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#fff" }}>
            Account Profile
          </h1>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
          Authenticated trader profile, Firebase session credentials, and security controls.
        </p>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="alert-error" style={{ marginBottom: "20px" }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* User Profile Card */}
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User Avatar"}
                  referrerPolicy="no-referrer"
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    border: "2px solid var(--accent)",
                    objectFit: "cover",
                    boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--accent) 0%, #6366f1 100%)",
                    display: "grid",
                    placeItems: "center",
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#fff",
                    boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
                  }}
                >
                  {getInitials(user?.displayName, user?.email)}
                </div>
              )}

              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>
                  {user?.displayName || "Authenticated Trader"}
                </h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "8px" }}>
                  {user?.email || "No email provided"}
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <span className="badge-up" style={{ fontSize: "12px" }}>
                    <CheckCircle2 size={12} />
                    Authenticated Session
                  </span>
                  {user?.emailVerified && (
                    <span className="badge-neutral" style={{ fontSize: "12px", color: "var(--accent-light)" }}>
                      Verified Email
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              id="btn-sign-out"
              type="button"
              className="btn-secondary"
              onClick={handleSignOut}
              disabled={loading}
              style={{
                color: "var(--danger)",
                borderColor: "rgba(244, 63, 94, 0.3)",
              }}
            >
              {loading ? <Loader2 size={16} className="spinner" /> : <LogOut size={16} />}
              <span>Sign Out</span>
            </button>
          </div>

          {/* Profile Attributes Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
              paddingTop: "20px",
              borderTop: "1px solid var(--border)",
            }}
          >
            <div style={{ background: "var(--surface-light)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border)" }}>
              <div className="stat-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Lock size={13} />
                <span>User Identifier (UID)</span>
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--text-primary)",
                  fontFamily: "monospace",
                  marginTop: "6px",
                  wordBreak: "break-all",
                }}
              >
                {user?.uid || "N/A"}
              </div>
            </div>

            <div style={{ background: "var(--surface-light)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border)" }}>
              <div className="stat-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Shield size={13} />
                <span>Auth Provider</span>
              </div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", marginTop: "4px", textTransform: "capitalize" }}>
                {user?.provider === "password" || user?.provider === "email/password"
                  ? "Email & Password"
                  : user?.provider === "google.com"
                  ? "Google Authentication"
                  : user?.provider || "Firebase"}
              </div>
            </div>

            <div style={{ background: "var(--surface-light)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border)" }}>
              <div className="stat-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Database size={13} />
                <span>Prediction Scoping</span>
              </div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--success)", marginTop: "4px" }}>
                Private (UID Scoped)
              </div>
            </div>

            {user?.metadata?.creationTime && (
              <div style={{ background: "var(--surface-light)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border)" }}>
                <div className="stat-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Calendar size={13} />
                  <span>Account Created</span>
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
                  {new Date(user.metadata.creationTime).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security & Architecture Status Card */}
        <div className="card">
          <h3
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <Shield size={18} color="var(--accent-light)" />
            <span>Firebase Security & Zero-Trust Persistence</span>
          </h3>

          <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, marginBottom: "16px" }}>
            Predictions generated during your authenticated sessions are strictly partitioned under your unique identifier (<code>{user?.uid}</code>). No cross-tenant access is permitted.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 16px",
              borderRadius: "8px",
              background: isFirebaseActive ? "rgba(16, 185, 129, 0.08)" : "rgba(139, 92, 246, 0.08)",
              border: `1px solid ${isFirebaseActive ? "rgba(16, 185, 129, 0.25)" : "rgba(139, 92, 246, 0.25)"}`,
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: isFirebaseActive ? "var(--success)" : "var(--accent-light)",
                boxShadow: isFirebaseActive ? "0 0 10px var(--success)" : "0 0 10px var(--accent-light)",
              }}
            />
            <span style={{ fontSize: "13px", color: isFirebaseActive ? "var(--success)" : "var(--accent-light)", fontWeight: 600 }}>
              {isFirebaseActive
                ? "Live Firebase Authentication Active"
                : "Firebase Environment Configuration Ready"}
            </span>
          </div>
        </div>

        {/* ML Prediction Engine Reference */}
        <div className="card">
          <h3
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <Cpu size={18} color="var(--primary-light)" />
            <span>Model Integration Specifications</span>
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: 1.6 }}>
            The prediction engine queries the pre-trained LSTM network (<code>models/best_lstm_model.keras</code>) accepting 60 time steps × 26 engineered technical features. Your user session preserves every forecast run with immutable creation timestamps.
          </p>
        </div>
      </div>
    </div>
  );
}
