import { formatCurrency } from '../services/dataContract';

function ItineraryCard({ day, time, activity, cost, location }) {
  return (
    <div className="itinerary-item">
      <div className="day-badge">Day {day}</div>
      <div className="itinerary-content">
        <div className="time-block">
          <span className="label">Time</span>
          <strong>{time}</strong>
        </div>
        <div className="time-block">
          <span className="label">Activity</span>
          <strong>{activity}</strong>
        </div>
        <div className="time-block">
          <span className="label">Estimated Cost</span>
          <strong>{formatCurrency(cost)}</strong>
        </div>
        <div className="time-block">
          <span className="label">Location</span>
          <strong>{location}</strong>
        </div>
      </div>
    </div>
  );
}

export default ItineraryCard;
