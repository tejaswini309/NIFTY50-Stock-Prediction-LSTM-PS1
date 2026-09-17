import { Activity, User } from "lucide-react";
import "../styles/navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <div className="brand-icon">
            <Activity size={20} />
          </div>

          <div>
            <div className="brand-name">NIFTY 50</div>
            <div className="brand-subtitle">Stock Intelligence</div>
          </div>
        </div>

        <nav className="navbar-links">
          <a href="#dashboard">Dashboard</a>
          <a href="#history">History</a>
        </nav>

        <button className="profile-button" type="button">
          <User size={18} />
          <span>Account</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;