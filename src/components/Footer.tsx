import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand">
              <span className="brand-logo" style={{ width: 34, height: 34 }}>
                <svg viewBox="0 0 24 24" fill="none" style={{ width: 20, height: 20 }}>
                  <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
                  <path d="M12 5.5c-1 1.4-2.8 1.6-2.8 1.6s1.8.8 1.8 2.3c0 .9-.5 1.7-1.3 2.2.8.5 1.3 1.3 1.3 2.2 0 1.5-1.8 2.3-1.8 2.3s1.8.2 2.8 1.6c1-1.4 2.8-1.6 2.8-1.6S13 16 13 14.5c0-.9.5-1.7 1.3-2.2-.8-.5-1.3-1.3-1.3-2.2 0-1.5 1.8-2.3 1.8-2.3S13 6.9 12 5.5z" fill="white" />
                </svg>
              </span>
              <span>
                Nibourly
                <em>Nepal · Society · Daily Life</em>
              </span>
            </div>
            <p className="muted small mt-2" style={{ maxWidth: 320 }}>
              An AI-powered community platform to report civic problems, explore all 77 districts of Nepal, and find real solutions for society &amp; daily life.
            </p>
          </div>
          <div>
            <h4>Platform</h4>
            <Link to="/explore">Explore Nepal</Link>
            <Link to="/report">Report an Issue</Link>
            <Link to="/community">Community Board</Link>
            <Link to="/solutions">Solutions Library</Link>
          </div>
          <div>
            <h4>AI &amp; Help</h4>
            <Link to="/assistant">AI Sathi Chat</Link>
            <Link to="/emergency">Emergency Numbers</Link>
            <Link to="/settings">Settings</Link>
            <Link to="/help">How it Works</Link>
          </div>
          <div>
            <h4>Emergency</h4>
            <p className="small muted">Police — 100</p>
            <p className="small muted">Fire — 101</p>
            <p className="small muted">Ambulance — 102</p>
            <p className="small muted">Disaster — 1149</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Nibourly — For the society of Nepal 🇳🇵</span>
          <span>Made with ❤️ for 7 provinces · 77 districts</span>
        </div>
      </div>
    </footer>
  );
}
