import { MapPin, Star } from 'lucide-react';

function BusinessCard({ business }) {
  if (!business) {
    return null;
  }

  return (
    <article className="business-card">
      <div className="business-image-wrap">
        <img src={business.image} alt={business.name} />
      </div>

      <div className="business-body">
        <div className="business-topline">
          <span className="business-category">{business.category}</span>
          <span className="rating-line">
            <Star size={13} /> {business.rating}
          </span>
        </div>

        <h3>{business.name}</h3>
        <div className="meta-row">
          <span>{business.priceRange}</span>
          <span>
            <MapPin size={12} /> {business.location}
          </span>
        </div>
        <p>{business.description}</p>
        <button type="button" className="secondary-btn small-btn">
          View
        </button>
      </div>
    </article>
  );
}

export default BusinessCard;
