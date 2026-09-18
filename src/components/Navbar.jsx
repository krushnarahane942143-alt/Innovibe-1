import { useState, useEffect } from 'react';
import { Compass, Map, Plane, Sparkles, Moon, Sun, Menu, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';

function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('smartTourismDarkMode');
    return saved === 'true';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('smartTourismDarkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: 'Home', to: '/', icon: Sparkles },
    { label: 'Plan Trip', to: '/plan', icon: Plane },
    { label: 'Explore', to: '/recommendations', icon: Compass },
    { label: 'My Itinerary', to: '/itinerary', icon: Map },
  ];

  return (
    <header className="site-header">
      <div className="container navbar">
        <Link to="/" className="brand" aria-label="SmartTour home">
          <span className="brand-mark">S</span>
          <span>SmartTour</span>
        </Link>

        <nav className="nav-menu" aria-label="Main navigation">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              aria-current={location.pathname === to ? 'page' : undefined}
            >
              <Icon size={15} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="navbar-actions">
          <button
            className="dark-mode-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <Link to="/plan" className="primary-btn nav-cta">
            Plan My Trip
          </Link>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}

export default Navbar;
