import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowRight, Filter, Sparkles, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import DestinationCard from '../components/DestinationCard';
import SectionTitle from '../components/SectionTitle';
import { getRecommendationsApi } from '../services/api';
import { getAlternativeDestination, getCrowdStatus } from '../utils/crowdEngine';
import LoadingSpinner from '../components/LoadingSpinner';
import UseInView from '../hooks/useInView';
import { useToast } from '../hooks/useToast';

const ALL_INTERESTS = ['Nature', 'History', 'Adventure', 'Food', 'Culture', 'Beaches', 'Wildlife', 'Spiritual'];

function SkeletonCard() {
  return (
    <div className="skeleton skeleton-card">
      <div style={{ height: '220px', borderRadius: '22px 22px 0 0' }} className="skeleton" />
      <div style={{ padding: '20px 18px 18px' }}>
        <div className="skeleton skeleton-text medium" />
        <div className="skeleton skeleton-text short" />
        <div className="skeleton skeleton-text" style={{ marginTop: '16px' }} />
        <div className="skeleton skeleton-text medium" />
      </div>
    </div>
  );
}

function Recommendations() {
  const { addToast } = useToast();
  const [preferences, setPreferences] = useState({
    destination: 'Maharashtra',
    days: 3,
    budget: 15000,
    travelers: 4,
    travelType: 'Family',
    interests: ['Nature', 'History'],
    season: 'Winter',
    crowdPreference: 'Prefer low crowd',
  });
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [interestFilter, setInterestFilter] = useState('All interests');
  const [crowdFilter, setCrowdFilter] = useState('All crowd levels');
  const [sortBy, setSortBy] = useState('Best match');
  const { ref, isVisible } = UseInView();

  useEffect(() => {
    let requestPreferences = preferences;
    const saved = localStorage.getItem('smartTourismPreferences');
    if (saved) {
      try {
        requestPreferences = { ...preferences, ...JSON.parse(saved) };
        setPreferences(requestPreferences);
      } catch (error) {
        console.error('Error reading saved trip preferences', error);
      }
    }

    getRecommendationsApi(requestPreferences).then((result) => {
      setDestinations(result);
      setLoading(false);
    }).catch(() => {
      addToast('Failed to load recommendations', 'error');
      setLoading(false);
    });
  }, []);

  const topDestination = destinations[0];
  const altDestination = useMemo(
    () => {
      if (!topDestination) return null;
      const alt = getAlternativeDestination(topDestination);
      return alt;
    },
    [topDestination]
  );

  const crowdStatus = topDestination ? getCrowdStatus(topDestination) : 'LOW';

  const filteredDestinations = useMemo(() => {
    const filtered = destinations.filter((dest) => {
      const matchesSearch = !searchQuery ||
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = activeFilter === 'All' ||
        dest.category === activeFilter ||
        dest.tags?.includes(activeFilter);

      const matchesInterest = interestFilter === 'All interests' || dest.interests?.includes(interestFilter) || dest.tags?.includes(interestFilter);
      const matchesCrowd = crowdFilter === 'All crowd levels' || dest.crowd === crowdFilter;

      return matchesSearch && matchesFilter && matchesInterest && matchesCrowd;
    });

    return [...filtered].sort((first, second) => {
      if (sortBy === 'Lowest crowd') {
        return ({ LOW: 0, MEDIUM: 1, HIGH: 2 }[first.crowd] || 1) - ({ LOW: 0, MEDIUM: 1, HIGH: 2 }[second.crowd] || 1);
      }

      if (sortBy === 'Lowest cost') {
        return first.estimatedCost - second.estimatedCost;
      }

      return (second.matchPercent || second.matchScore || 0) - (first.matchPercent || first.matchScore || 0);
    });
  }, [destinations, searchQuery, activeFilter, interestFilter, crowdFilter, sortBy]);

  const categories = ['All', ...new Set(destinations.map(d => d.category))];

  return (
    <div className="page-container">
      <SectionTitle
        eyebrow="Personalized picks"
        title="Destinations Recommended For You"
        subtitle="Based on your travel preferences and crowd-aware insights."
      />

      {!loading && (
        <div className="preferences-summary">
          <span>
            {preferences.days} Days • {preferences.travelType} • ₹{preferences.budget} • {preferences.interests.join(' + ')}
          </span>
        </div>
      )}

      <div className="search-bar">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          placeholder="Search destinations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search destinations"
        />
      </div>

      <div className="filter-tags" role="group" aria-label="Filter by category">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-tag ${activeFilter === cat ? 'active' : ''}`}
            onClick={() => setActiveFilter(cat)}
            aria-pressed={activeFilter === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="explore-controls">
        <div className="explore-control-label"><Filter size={16} /> Refine your explore list</div>
        <label className="compact-control">
          <span>Interest</span>
          <select value={interestFilter} onChange={(event) => setInterestFilter(event.target.value)}>
            <option>All interests</option>
            {ALL_INTERESTS.map((interest) => <option key={interest}>{interest}</option>)}
          </select>
        </label>
        <label className="compact-control">
          <span>Crowd</span>
          <select value={crowdFilter} onChange={(event) => setCrowdFilter(event.target.value)}>
            <option>All crowd levels</option>
            <option value="LOW">Low crowd</option>
            <option value="MEDIUM">Medium crowd</option>
            <option value="HIGH">High crowd</option>
          </select>
        </label>
        <label className="compact-control">
          <span>Sort</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option>Best match</option>
            <option>Lowest crowd</option>
            <option>Lowest cost</option>
          </select>
        </label>
      </div>

      {loading ? (
        <div className="destination-grid">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
          {topDestination && crowdStatus === 'HIGH' && altDestination && (
            <div className="crowd-warning-box animate-on-scroll" ref={ref}>
              <div className={isVisible ? 'visible' : ''}>
                <AlertTriangle size={18} />
                <span>{topDestination.name} is expected to be crowded.</span>
              </div>
              <div className="alt-box-wrapper">
                <div className="alt-box-row">
                  <div className="alt-detail">
                    <span className="small-label">Recommended alternative</span>
                    <h3>{altDestination.name}</h3>
                    <p>
                      {altDestination.name} offers a similar {preferences.interests[0]?.toLowerCase() || 'nature'} experience with lower expected crowd.
                    </p>
                  </div>
                  <Link to={`/destination/${altDestination.id}`} className="primary-btn">
                    View alternative <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {filteredDestinations.length === 0 ? (
            <div className="empty-state">
              <Sparkles size={48} color="var(--muted)" />
              <h3>No destinations found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="destination-grid recommendation-grid">
              {filteredDestinations.map((destination, index) => (
                <div key={destination.id} className={`animate-on-scroll ${isVisible ? 'visible' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <DestinationCard destination={destination} />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="cta-banner animate-on-scroll" ref={ref}>
        <div className={isVisible ? 'visible' : ''}>
          <Sparkles size={18} />
          <span>Want the best route for this trip?</span>
        </div>
        <Link to="/itinerary" className="primary-btn">
          View Smart Itinerary
        </Link>
      </div>
    </div>
  );
}

export default Recommendations;
