import { ArrowRight, MapPinned } from 'lucide-react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <span className="badge">AI-powered travel planning</span>
        <h1>Travel Smarter. Explore Better.</h1>
        <p>
          AI-powered travel planning that creates personalized trips and helps you discover less-crowded destinations.
        </p>
        <div className="hero-actions">
          <Link to="/plan" className="primary-btn">
            Plan My Trip <ArrowRight size={18} />
          </Link>
          <Link to="/recommendations" className="secondary-btn">
            Explore Destinations
          </Link>
        </div>
        <div className="hero-metrics">
          <div>
            <strong>9K+</strong>
            <span>Trips planned</span>
          </div>
          <div>
            <strong>92%</strong>
            <span>Match accuracy</span>
          </div>
          <div>
            <strong>250+</strong>
            <span>Local businesses</span>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-image-card">
          <img
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80"
            alt="Scenic Indian mountain destination"
          />
          <div className="hero-floating-badge">
            <MapPinned size={16} />
            <span>Smart route • Lower crowd</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
