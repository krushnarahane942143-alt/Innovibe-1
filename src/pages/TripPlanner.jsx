import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PreferenceForm from '../components/PreferenceForm';
import SectionTitle from '../components/SectionTitle';
import UseInView from '../hooks/useInView';
import { useToast } from '../hooks/useToast';
import { buildItineraryFromPreferences } from '../data/itineraries';

const defaultPrefs = {
  destination: 'Maharashtra',
  days: 3,
  budget: 15000,
  travelers: 4,
  travelType: 'Family',
  interests: ['Nature', 'History'],
  season: 'Winter',
  accommodation: 'Comfort stay',
  pace: 'Balanced',
  transport: 'Own vehicle',
  crowdPreference: 'Prefer low crowd',
};

function TripPlanner() {
  const [preferences, setPreferences] = useState(defaultPrefs);
  const [saved, setSaved] = useState(false);
  const { addToast } = useToast();
  const { ref, isVisible } = UseInView();

  useEffect(() => {
    const saved = localStorage.getItem('smartTourismPreferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPreferences((current) => ({ ...current, ...parsed }));
      } catch (error) {
        console.error('Error reading saved trip preferences', error);
      }
    }
  }, []);

  const handleSave = (formValues) => {
    const nextPreferences = { ...preferences, ...formValues };
    const generatedItinerary = buildItineraryFromPreferences(nextPreferences);

    localStorage.setItem('smartTourismPreferences', JSON.stringify(nextPreferences));
    localStorage.setItem('smartTourismItinerary', JSON.stringify(generatedItinerary));
    setPreferences(nextPreferences);
    setSaved(true);
    addToast('Trip plan saved and itinerary generated!', 'success');
  };

  return (
    <div className="page-container small-container">
      <SectionTitle
        eyebrow="Trip planner"
        title="Plan Your Smart Trip"
        subtitle="Tell us what kind of experience you want, and SmartTour will recommend the best destination, crowd risk, and trip flow."
      />

      <div className={`planner-panel animate-on-scroll ${isVisible ? 'visible' : ''}`} ref={ref}>
        <PreferenceForm initialValues={preferences} onSave={handleSave} />
      </div>

      {saved && (
        <div className="cta-banner animate-on-scroll visible" ref={ref}>
          <div>
            <span>Your trip plan has been generated and saved.</span>
          </div>
          <div className="cta-actions">
            <Link to="/itinerary" className="primary-btn">
              View Itinerary
            </Link>
            <Link to="/recommendations" className="secondary-btn">
              Explore Destinations
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default TripPlanner;
