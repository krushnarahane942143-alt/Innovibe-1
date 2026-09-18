import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, Clock3, Landmark, MapPin, ShoppingBag, Sparkles, Utensils, Wallet } from 'lucide-react';
import { destinations } from '../data/destinations';
import CrowdBadge from '../components/CrowdBadge';
import { getAlternativeDestination, getCrowdStatus } from '../utils/crowdEngine';

function DestinationDetails() {
  const { id } = useParams();
  const destination = destinations.find((item) => item.id === id) || destinations[0];
  const crowdStatus = getCrowdStatus(destination);
  const alternative = useMemo(() => getAlternativeDestination(destination), [destination]);

  const reasons = [
    `Matches your interest in ${destination.interests[0] || 'travel'}`,
    `Fits your budget in the ₹${destination.estimatedCost} range`,
    `Suitable for ${destination.bestTime} travel`,
    crowdStatus === 'LOW' ? 'Lower expected crowd' : 'Good destination fit',
  ];

  return (
    <div className="page-container detail-page">
      <div className={`destination-detail-card ${destination.id === 'jaipur' ? 'jaipur-detail-card' : ''}`}>
        <div className="detail-image-wrap">
          <img src={destination.image} alt={destination.name} />
        </div>

        <div className="detail-content">
          <div className="detail-topbar">
            <div>
              <span className="section-eyebrow">Destination</span>
              <h1>{destination.name}</h1>
            </div>
            <CrowdBadge crowd={crowdStatus} />
          </div>

          <div className="detail-meta-row">
            <span>
              <MapPin size={14} /> {destination.state}
            </span>
            <span>
              <Clock3 size={14} /> Best time: {destination.bestTime}
            </span>
            <span>
              <Wallet size={14} /> ₹{destination.estimatedCost}
            </span>
          </div>

          <p className="detail-description">{destination.description}</p>

          {destination.id === 'jaipur' && (
            <div className="jaipur-spotlight" aria-label="Jaipur travel highlights">
              <div>
                <Landmark size={17} />
                <span>Royal heritage</span>
              </div>
              <div>
                <ShoppingBag size={17} />
                <span>Pink City markets</span>
              </div>
              <div>
                <Utensils size={17} />
                <span>Rajasthani food</span>
              </div>
            </div>
          )}

          <div className="detail-grid">
            <div>
              <h3>Major attractions</h3>
              <ul>
                {destination.attractions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Things to do</h3>
              <ul>
                {['Nature walks', 'Local food trails', 'Sunset viewing', 'Scenic drives'].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="why-recommended-box">
            <h3>
              <Sparkles size={18} /> Why we recommend this
            </h3>
            <ul>
              {reasons.map((reason) => (
                <li key={reason}>
                  <CheckCircle2 size={16} /> {reason}
                </li>
              ))}
            </ul>
          </div>

          {alternative && (
            <div className="smart-alternative-box">
              <h3>Smart Alternative</h3>
              <p>
                {alternative.name} is a better fit when {destination.name} is crowded, with a similar {destination.interests[0]?.toLowerCase() || 'nature'} experience and lower traffic.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DestinationDetails;
