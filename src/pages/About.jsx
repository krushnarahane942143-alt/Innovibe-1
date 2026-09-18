import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';

const roadmap = [
  'User Preferences',
  'Recommendation Engine',
  'Crowd Prediction',
  'Alternative Destination',
  'Smart Itinerary',
  'Local Business Discovery',
];

const futureScope = [
  'Real-time crowd prediction',
  'Google Maps integration',
  'Hotel booking',
  'AI chatbot',
  'Government tourism dashboard',
  'Live tourism analytics',
  'Weather integration',
  'Event/festival awareness',
];

function About() {
  return (
    <div className="page-container about-page">
      <SectionTitle
        eyebrow="How it works"
        title="How Our Platform Works"
        subtitle="A complete smart tourism journey from preference capture to recommendation, crowd-aware planning, and local discovery."
      />

      <div className="flow-steps">
        {roadmap.map((step, index) => (
          <div key={step} className="flow-step">
            <span>{index + 1}</span>
            <p>{step}</p>
          </div>
        ))}
      </div>

      <div className="future-box">
        <h3>Future Scope</h3>
        <ul>
          {futureScope.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="cta-banner about-cta">
        <div>
          <span>Ready to plan your next trip smarter?</span>
        </div>
        <Link to="/plan" className="primary-btn">
          Start planning <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

export default About;
