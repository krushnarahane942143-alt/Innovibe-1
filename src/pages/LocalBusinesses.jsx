import { useEffect, useState } from 'react';
import { businesses } from '../data/businesses';
import BusinessCard from '../components/BusinessCard';
import SectionTitle from '../components/SectionTitle';

const businessGroups = [
  { name: 'Hotels', key: 'Hotel' },
  { name: 'Restaurants', key: 'Restaurant' },
  { name: 'Local Guides', key: 'Local Guide' },
  { name: 'Homestays', key: 'Homestay' },
  { name: 'Local Experiences', key: 'Local Experience' },
];

function LocalBusinesses() {
  const [selectedCategory, setSelectedCategory] = useState('Hotels');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const currentBusinesses = businesses.filter((item) => item.category === businessGroups.find((g) => g.name === selectedCategory)?.key);

  return (
    <div className="page-container small-container">
      <SectionTitle
        eyebrow="Local business network"
        title="Support Local Businesses"
        subtitle="SmartTour promotes tourist-friendly businesses that improve the local economy and traveler experience."
      />

      <div className="business-tabs">
        {businessGroups.map((group) => (
          <button
            key={group.name}
            type="button"
            className={`tab-btn ${selectedCategory === group.name ? 'active' : ''}`}
            onClick={() => setSelectedCategory(group.name)}
          >
            {group.name}
          </button>
        ))}
      </div>

      <div className="business-grid">
        {currentBusinesses.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
    </div>
  );
}

export default LocalBusinesses;
