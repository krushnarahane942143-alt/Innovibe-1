import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function AlternativeCard({ destination, message }) {
  if (!destination) {
    return null;
  }

  return (
    <div className="alternative-panel">
      <div className="alternative-header">
        <div className="warning-chip">
          <AlertTriangle size={16} />
          <span>High crowd expected</span>
        </div>
      </div>

      <div className="alternative-row">
        <div className="alternative-box current">
          <span className="small-label">Current</span>
          <h4>{destination.name}</h4>
          <p>{destination.crowd}</p>
        </div>

        <div className="alternative-arrow">
          <ArrowRight size={18} />
        </div>

        <div className="alternative-box recommended">
          <span className="small-label">Alternative</span>
          <h4>{destination.alternative?.name || destination.name}</h4>
          <p>{destination.alternative?.description || 'Lower crowd and similar experience'}</p>
        </div>
      </div>

      {message && <p className="alternative-message">{message}</p>}

      <Link to={`/destination/${destination.alternative?.id || destination.id}`} className="secondary-btn alt-link">
        Explore alternative
      </Link>
    </div>
  );
}

export default AlternativeCard;
