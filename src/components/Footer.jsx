import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <div className="brand footer-brand">
            <span className="brand-mark">S</span>
            <span>SmartTour</span>
          </div>
          <p>AI-powered, crowd-aware travel planning for smarter tourism experiences.</p>
        </div>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/plan">Plan Trip</Link>
          <Link to="/recommendations">Explore</Link>
          <Link to="/about">About</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
