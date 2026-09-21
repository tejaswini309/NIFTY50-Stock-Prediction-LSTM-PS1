import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Activity,
  History,
  User,
  Menu,
  X,
  CheckCircle2,
  LogIn,
  UserPlus,
  LogOut
} from "lucide-react";
import { useAuth } from "../context/useAuth";
import "../styles/navbar.css";

export default function Navbar() {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = Boolean(user && !user.isAnonymous);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate("/login");
    } catch (err) {
      console.error("Failed to sign out:", err);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="brand" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="brand-icon">
            <Activity size={22} />
          </div>
          <div>
            <div className="brand-name">NIFTY 50</div>
            <div className="brand-subtitle">Stock Intelligence</div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            <Activity size={16} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            <History size={16} />
            <span>Prediction History</span>
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/account"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              <User size={16} />
              <span>Account</span>
            </NavLink>
          )}
        </nav>

        {/* Right side: Auth CTA / User Profile & Mobile Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link to="/account" style={{ textDecoration: "none" }}>
                <button className="profile-button" type="button" title="View Account Profile">
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "var(--accent)",
                      display: "grid",
                      placeItems: "center",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                  >
                    {user?.displayName ? user.displayName[0].toUpperCase() : "U"}
                  </div>
                  <span style={{ maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.displayName || user.email}
                  </span>
                  <CheckCircle2 size={13} color="var(--success)" />
                </button>
              </Link>

              <button
                type="button"
                className="btn-ghost"
                onClick={handleSignOut}
                title="Sign Out"
                style={{ padding: "8px 10px", color: "var(--text-muted)" }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ height: "36px", padding: "0 14px", fontSize: "13px" }}
                >
                  <LogIn size={14} />
                  <span>Sign In</span>
                </button>
              </Link>

              <Link to="/signup" style={{ textDecoration: "none" }}>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ height: "36px", padding: "0 14px", fontSize: "13px" }}
                >
                  <UserPlus size={14} />
                  <span>Sign Up</span>
                </button>
              </Link>
            </div>
          )}

          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => (isActive ? "mobile-nav-link active" : "mobile-nav-link")}
          >
            <Activity size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/history"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => (isActive ? "mobile-nav-link active" : "mobile-nav-link")}
          >
            <History size={18} />
            <span>Prediction History</span>
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/account"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => (isActive ? "mobile-nav-link active" : "mobile-nav-link")}
              >
                <User size={18} />
                <span>Account ({user?.displayName || user?.email})</span>
              </NavLink>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="mobile-nav-link"
                style={{
                  background: "transparent",
                  border: "none",
                  width: "100%",
                  textAlign: "left",
                  color: "var(--danger)",
                  cursor: "pointer",
                }}
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => (isActive ? "mobile-nav-link active" : "mobile-nav-link")}
              >
                <LogIn size={18} />
                <span>Sign In</span>
              </NavLink>

              <NavLink
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => (isActive ? "mobile-nav-link active" : "mobile-nav-link")}
              >
                <UserPlus size={18} />
                <span>Sign Up</span>
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}
