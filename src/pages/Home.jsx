import { useRef } from 'react';
import { ArrowRight, MapPinned, Sparkles, Users, Globe2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import SectionTitle from '../components/SectionTitle';
import { destinations } from '../data/destinations';
import DestinationCard from '../components/DestinationCard';
import UseInView from '../hooks/useInView';

const steps = [
  'Tell us your preferences',
  'Get personalized destinations',
  'Avoid overcrowded places',
  'Get your smart itinerary',
];

const features = [
  {
    icon: Sparkles,
    title: 'AI Personalized Recommendations',
    text: 'Tailored destination suggestions based on your budget, duration, travel type, and interests.',
  },
  {
    icon: MapPinned,
    title: 'Crowd Prediction',
    text: 'Understand expected destination congestion before you travel and choose better timing.',
  },
  {
    icon: Globe2,
    title: 'Smart Alternatives',
    text: 'When a destination is busy, we suggest a nearby option with a near-similar experience.',
  },
  {
    icon: Users,
    title: 'Local Business Discovery',
    text: 'Find local hotels, restaurants, guides, and experiences that benefit the community.',
  },
];

function Home() {
  const featuresRef = UseInView();
  const destinationsRef = UseInView();

  return (
    <div className="page-container">
      <Hero />

      <section className="content-section">
        <SectionTitle
          eyebrow="How it works"
          title="How SmartTour Works"
          subtitle="A simple, transparent travel decision flow that helps travelers avoid crowded routes and plan better."
        />

        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={step} className="step-card animate-on-scroll">
              <span className="step-number">0{index + 1}</span>
              <h3>{step}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section muted-section">
        <SectionTitle
          eyebrow="Why choose us"
          title="Why Smart Tourism?"
          subtitle="Our platform focuses on personalization, crowd awareness, and local economic upliftment."
        />

        <div className="feature-grid" ref={featuresRef.ref}>
          {features.map(({ icon: Icon, title, text }, index) => (
            <div
              key={title}
              className={`feature-card animate-on-scroll ${featuresRef.isVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="feature-icon">
                <Icon size={22} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="section-header-row">
          <SectionTitle
            eyebrow="Popular destinations"
            title="Explore India's Most Loved Destinations"
          />
          <Link to="/recommendations" className="text-link">
            See all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="destination-grid" ref={destinationsRef.ref}>
          {destinations.slice(0, 6).map((destination, index) => (
            <div
              key={destination.id}
              className={`animate-on-scroll ${destinationsRef.isVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <DestinationCard destination={{ ...destination, matchPercent: destination.matchScore }} />
            </div>
          ))}
        </div>
      </section>

      <section className="content-section trust-strip animate-on-scroll">
        <div className="trust-item">
          <ShieldCheck size={20} />
          <span>Transparent crowd insight</span>
        </div>
        <div className="trust-item">
          <MapPinned size={20} />
          <span>Local-first recommendations</span>
        </div>
        <div className="trust-item">
          <Sparkles size={20} />
          <span>AI-enhanced trip planning</span>
        </div>
      </section>
    </div>
  );
}

export default Home;
