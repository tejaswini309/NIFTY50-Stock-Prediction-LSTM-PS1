import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "grid",
          placeItems: "center",
          color: "var(--text-secondary)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Loader2 size={32} className="spinner" style={{ color: "var(--accent-light)", margin: "0 auto 16px" }} />
          <p style={{ fontSize: "14px" }}>Verifying authentication state...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to /login and preserve destination in location state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
