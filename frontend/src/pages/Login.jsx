import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Loader2,
  KeyRound,
  ArrowLeft,
  Activity
} from "lucide-react";
import { useAuth } from "../context/useAuth";

export default function Login() {
  const { signInWithEmail, signInWithGoogle, isFirebaseActive } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState(null);

  // Determine where to redirect after successful login
  const destination = location.state?.from?.pathname || "/";
  const redirectedFromProtected = Boolean(location.state?.from?.pathname);

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
      setError("Please enter your password.");
      return false;
    }
    return true;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      await signInWithEmail(email, password);
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || "Google sign-in was cancelled or failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setDemoLoading(true);
    try {
      await signInWithEmail("analyst@nifty50.ai", "Password123!");
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || "Demo login failed.");
    } finally {
      setDemoLoading(false);
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
            Sign In to NIFTY 50
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.5 }}>
            Access your secure LSTM prediction history, private evaluations, and account settings.
          </p>
        </div>

        {/* Notice if redirected from protected route */}
        {redirectedFromProtected && (
          <div className="alert-info" style={{ marginBottom: "20px" }}>
            <span>Sign in is required to view that protected page.</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="alert-error" style={{ marginBottom: "20px" }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "1px" }} />
            <div>{error}</div>
          </div>
        )}

        {/* Google Sign-In Button */}
        <button
          type="button"
          className="btn-secondary"
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading || demoLoading}
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
          <span>Continue with Google</span>
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
          <span>OR CONTINUE WITH EMAIL</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailLogin}>
          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="login-email"
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
                id="login-email"
                type="email"
                required
                className="input-field"
                placeholder="analyst@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: "42px" }}
                disabled={loading || googleLoading || demoLoading}
              />
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label
                htmlFor="login-password"
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Password
              </label>
            </div>
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
                id="login-password"
                type={showPassword ? "text" : "password"}
                required
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: "42px", paddingRight: "42px" }}
                disabled={loading || googleLoading || demoLoading}
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

          <button
            id="btn-submit-login"
            type="submit"
            className="btn-primary"
            disabled={loading || googleLoading || demoLoading}
            style={{ width: "100%", height: "46px" }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spinner" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Sign-In */}
        <div style={{ marginTop: "16px" }}>
          <button
            type="button"
            className="btn-ghost"
            onClick={handleDemoLogin}
            disabled={loading || googleLoading || demoLoading}
            style={{
              width: "100%",
              height: "40px",
              justifyContent: "center",
              border: "1px dashed var(--border)",
              fontSize: "13px",
            }}
          >
            {demoLoading ? (
              <Loader2 size={16} className="spinner" />
            ) : (
              <KeyRound size={15} color="var(--accent-light)" />
            )}
            <span>Quick Demo Sign-In (Analyst Mode)</span>
          </button>
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
          <span>Don't have an account? </span>
          <Link
            to="/signup"
            style={{ color: "var(--accent-light)", fontWeight: 600, textDecoration: "none" }}
          >
            Create an account
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
