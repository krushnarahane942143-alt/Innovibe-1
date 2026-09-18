import { useEffect, useState } from 'react';
import { Download, MapPinned, PencilLine, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import ItineraryCard from '../components/ItineraryCard';
import SectionTitle from '../components/SectionTitle';
import { buildItineraryFromPreferences, getDefaultItinerary } from '../data/itineraries';
import { formatCurrency } from '../services/dataContract';

function Itinerary() {
  const [itinerary, setItinerary] = useState(getDefaultItinerary('matheran'));

  const loadItinerary = () => {
    const savedPlan = localStorage.getItem('smartTourismPreferences');
    const savedItinerary = localStorage.getItem('smartTourismItinerary');

    if (savedItinerary) {
      try {
        const parsed = JSON.parse(savedItinerary);
        if (parsed?.days?.length) {
          setItinerary(parsed);
          return;
        }
      } catch (error) {
        console.error('Error reading saved itinerary', error);
      }
    }

    if (savedPlan) {
      try {
        const parsed = JSON.parse(savedPlan);
        const generated = buildItineraryFromPreferences(parsed);
        localStorage.setItem('smartTourismItinerary', JSON.stringify(generated));
        setItinerary(generated);
      } catch (error) {
        console.error('Error loading itinerary preferences', error);
      }
    }
  };

  const regenerateItinerary = () => {
    const savedPlan = localStorage.getItem('smartTourismPreferences');

    if (!savedPlan) {
      return;
    }

    try {
      const parsed = JSON.parse(savedPlan);
      const generated = buildItineraryFromPreferences(parsed);
      setItinerary(generated);
      localStorage.setItem('smartTourismItinerary', JSON.stringify(generated));
    } catch (error) {
      console.error('Error regenerating itinerary', error);
    }
  };

  useEffect(() => {
    loadItinerary();
  }, []);

  return (
    <div className="page-container itinerary-page">
      <SectionTitle
        eyebrow="Smart itinerary"
        title={`${itinerary.destination || 'Your Smart'} Itinerary`}
        subtitle="A practical, day-wise flow designed around your trip plan, budget, and travel style."
      />

      <div className="itinerary-actions">
        <button type="button" className="primary-btn" onClick={regenerateItinerary}>
          <RotateCcw size={16} /> Regenerate
        </button>
        <Link to="/plan" className="secondary-btn">
          <PencilLine size={16} /> Change itinerary
        </Link>
      </div>

      <div className="itinerary-layout">
        <div className="itinerary-list">
          {itinerary.days.map((item) => (
            <ItineraryCard
              key={`${item.day}-${item.time}-${item.activity}`}
              day={item.day}
              time={item.time}
              activity={item.activity}
              cost={item.cost}
              location={item.location}
            />
          ))}
        </div>

        <aside className="itinerary-sidebar">
          <h3>Trip Summary</h3>

          <div className="summary-row">
            <span>Total estimated cost</span>
            <strong>{formatCurrency(itinerary.summary.total)}</strong>
          </div>
          <div className="summary-row">
            <span>Accommodation</span>
            <strong>{formatCurrency(itinerary.summary.accommodation)}</strong>
          </div>
          <div className="summary-row">
            <span>Food</span>
            <strong>{formatCurrency(itinerary.summary.food)}</strong>
          </div>
          <div className="summary-row">
            <span>Transport</span>
            <strong>{formatCurrency(itinerary.summary.transport)}</strong>
          </div>
          <div className="summary-row">
            <span>Activities</span>
            <strong>{formatCurrency(itinerary.summary.activities)}</strong>
          </div>

          <button type="button" className="primary-btn download-btn">
            <Download size={18} /> Download Itinerary
          </button>
        </aside>
      </div>
    </div>
  );
}

export default Itinerary;
