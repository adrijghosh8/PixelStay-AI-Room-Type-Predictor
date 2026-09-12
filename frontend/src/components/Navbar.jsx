import { useBackendStatus } from '../hooks/useBackendStatus';
import '../styles/navbar.css';

const STATUS_TEXT = {
  checking: 'Checking…',
  online: 'Model Online',
  offline: 'Model Offline',
};

export default function Navbar({ onNavigate }) {
  const status = useBackendStatus();

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <div className="navbar__brand">
          <span className="navbar__logo pixel-heading">PIXELSTAY</span>
          <span className="navbar__subtitle">AI Room Type Predictor</span>
        </div>

        <nav className="navbar__links" aria-label="Primary">
          <button className="navbar__link" onClick={() => onNavigate('home')}>
            Home
          </button>
          <button className="navbar__link" onClick={() => onNavigate('predict')}>
            Predict
          </button>
          <button className="navbar__link" onClick={() => onNavigate('about')}>
            About
          </button>
        </nav>

        <div className={`navbar__status navbar__status--${status}`} role="status">
          <span className="navbar__status-dot" aria-hidden="true" />
          {STATUS_TEXT[status]}
        </div>
      </div>
    </header>
  );
}
