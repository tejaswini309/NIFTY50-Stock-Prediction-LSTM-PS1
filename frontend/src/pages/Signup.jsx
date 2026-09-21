import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Activity,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "../context/useAuth";

export default function Signup() {
  const { signUpWithEmail, signInWithGoogle, isFirebaseActive } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateForm = () => {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Please enter your email address.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError("Please enter a valid email format (e.g. name@domain.com).");
      return false;
    }
    if (!password) {
      setError("Please choose a password.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      await signUpWithEmail(email, password, confirmPassword);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Google registration was cancelled or failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: "480px", paddingTop: "40px" }}>
      {/* Return to Dashboard link */}
      <Link
        to="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          color: "var(--text-secondary)",
          textDecoration: "none",
          fontSize: "14px",
          marginBottom: "24px",
          transition: "color 0.15s ease",
        }}
      >
        <ArrowLeft size={16} />
        <span>Return to Prediction Dashboard</span>
      </Link>

      <div className="card" style={{ padding: "32px 28px" }}>
        {/* Brand header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "rgba(139, 92, 246, 0.14)",
              border: "1px solid rgba(139, 92, 246, 0.35)",
              color: "var(--accent-light)",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 16px",
              boxShadow: "0 0 20px rgba(139, 92, 246, 0.2)",
            }}
          >
            <Activity size={24} />
          </div>

          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>
            Create Your Account
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.5 }}>
            Join NIFTY 50 to store verified LSTM predictions, track stocks, and manage sessions.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="alert-error" style={{ marginBottom: "20px" }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "1px" }} />
            <div>{error}</div>
          </div>
        )}

        {/* Google Sign-Up Button */}
        <button
          type="button"
          className="btn-secondary"
          onClick={handleGoogleSignup}
          disabled={loading || googleLoading}
          style={{
            width: "100%",
            height: "46px",
            justifyContent: "center",
            marginBottom: "20px",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {googleLoading ? (
            <Loader2 size={18} className="spinner" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          )}
          <span>Sign up with Google</span>
        </button>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "20px 0",
            color: "var(--text-muted)",
            fontSize: "12px",
            letterSpacing: "0.05em",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          <span>OR SIGN UP WITH EMAIL</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="signup-email"
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "6px",
              }}
            >
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail
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
                id="signup-email"
                type="email"
                required
                className="input-field"
                placeholder="analyst@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: "42px" }}
                disabled={loading || googleLoading}
              />
            </div>
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="signup-password"
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "6px",
              }}
            >
              Password (Min 6 Characters)
            </label>
            <div style={{ position: "relative" }}>
              <Lock
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
                id="signup-password"
                type={showPassword ? "text" : "password"}
                required
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: "42px", paddingRight: "42px" }}
                disabled={loading || googleLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: "4px",
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="signup-confirm-password"
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "6px",
              }}
            >
              Confirm Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
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
                id="signup-confirm-password"
                type={showPassword ? "text" : "password"}
                required
                className="input-field"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ paddingLeft: "42px" }}
                disabled={loading || googleLoading}
              />
            </div>
          </div>

          <button
            id="btn-submit-signup"
            type="submit"
            className="btn-primary"
            disabled={loading || googleLoading}
            style={{ width: "100%", height: "46px" }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spinner" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus size={18} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Benefits list */}
        <div style={{ marginTop: "24px", padding: "16px", background: "rgba(255, 255, 255, 0.02)", borderRadius: "10px", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "8px" }}>
            ACCOUNT PRIVILEGES
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: "var(--text-muted)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle2 size={14} color="var(--success)" />
              <span>Full access to private Prediction History</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle2 size={14} color="var(--success)" />
              <span>Session persistence across devices</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle2 size={14} color="var(--success)" />
              <span>Zero telemetry tracking or shared forecasts</span>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div
          style={{
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "1px solid var(--border)",
            textAlign: "center",
            fontSize: "14px",
            color: "var(--text-secondary)",
          }}
        >
          <span>Already have an account? </span>
          <Link
            to="/login"
            style={{ color: "var(--accent-light)", fontWeight: 600, textDecoration: "none" }}
          >
            Sign in
          </Link>
        </div>

        {/* Firebase indicator */}
        <div style={{ marginTop: "16px", textAlign: "center", fontSize: "11px", color: "var(--text-muted)" }}>
          {isFirebaseActive ? (
            <span style={{ color: "var(--success)" }}>● Live Firebase Authentication Active</span>
          ) : (
            <span>Environment ready for Firebase Authentication</span>
          )}
        </div>
      </div>
    </div>
  );
}
