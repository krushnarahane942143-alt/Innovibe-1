import { ArrowRight, MapPin, Tag, Wallet } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CrowdBadge from './CrowdBadge';

function DestinationCard({ destination }) {
  const navigate = useNavigate();

  if (!destination) {
    return null;
  }

  const destinationPath = `/destination/${destination.id}`;

  const handleCardClick = (event) => {
    if (event.target.closest('a, button')) {
      return;
    }

    navigate(destinationPath);
  };

  const handleCardKeyDown = (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && !event.target.closest('a, button')) {
      event.preventDefault();
      navigate(destinationPath);
    }
  };

  return (
    <article
      className="destination-card"
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role="link"
      tabIndex="0"
      aria-label={`View details for ${destination.name}`}
    >
      <div className="card-image-wrap">
        <img src={destination.image} alt={destination.name} />
      </div>

      <div className="card-body">
        <div className="card-header-row">
          <div>
            <h3>{destination.name}</h3>
            <p className="muted-location">
              <MapPin size={14} /> {destination.state}
            </p>
          </div>
          <span className="match-pill">{destination.matchPercent || destination.matchScore}% Match</span>
        </div>

        <p className="description">{destination.description}</p>

        <div className="meta-grid">
          <div>
            <Wallet size={14} />
            <span>₹{destination.estimatedCost}</span>
          </div>
          <div>
            <CrowdBadge crowd={destination.crowd} />
          </div>
        </div>

        <div className="mini-details">
          <span>Best time: {destination.bestTime}</span>
          <span>Distance: {destination.distance}</span>
        </div>

        <div className="tag-row">
          {(destination.tags || []).slice(0, 3).map((tag) => (
            <span key={tag} className="tag-chip">
              <Tag size={12} /> {tag}
            </span>
          ))}
        </div>

        <Link to={destinationPath} className="link-action">
          View Details <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}

export default DestinationCard;
