import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

const defaultForm = {
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

function PreferenceForm({ initialValues = defaultForm, onSave }) {
  const [form, setForm] = useState(initialValues);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm((current) => ({ ...current, ...initialValues }));
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value, type } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleInterestToggle = (interest) => {
    setForm((current) => {
      const currentInterests = current.interests || [];
      const exists = currentInterests.includes(interest);

      return {
        ...current,
        interests: exists
          ? currentInterests.filter((item) => item !== interest)
          : [...currentInterests, interest],
      };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!form.destination || !form.destination.trim()) {
      setError('Please enter a destination or region.');
      return;
    }

    if (form.days < 1) {
      setError('Trip duration must be at least 1 day.');
      return;
    }

    if (form.budget < 0) {
      setError('Budget cannot be negative.');
      return;
    }

    if (!form.travelType) {
      setError('Please choose a travel type.');
      return;
    }

    if (!form.interests || form.interests.length === 0) {
      setError('Please select at least one interest.');
      return;
    }

    setIsSubmitting(true);
    onSave?.(form);
    setTimeout(() => setIsSubmitting(false), 400);
  };

  return (
    <form className="planner-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          <span>Destination / Region</span>
          <input
            type="text"
            name="destination"
            value={form.destination}
            onChange={handleChange}
            placeholder="e.g. Maharashtra"
            aria-describedby="destination-help"
          />
          <span id="destination-help" className="field-hint">Enter a state or region in India</span>
        </label>

        <label>
          <span>Number of Days</span>
          <input type="number" name="days" min="1" max="30" value={form.days} onChange={handleChange} />
        </label>

        <label>
          <span>Budget (₹)</span>
          <input type="number" name="budget" min="0" step="1000" value={form.budget} onChange={handleChange} />
        </label>

        <label>
          <span>Number of Travelers</span>
          <input type="number" name="travelers" min="1" max="20" value={form.travelers} onChange={handleChange} />
        </label>

        <label>
          <span>Travel Type</span>
          <select name="travelType" value={form.travelType} onChange={handleChange}>
            <option value="Solo">Solo</option>
            <option value="Couple">Couple</option>
            <option value="Family">Family</option>
            <option value="Friends">Friends</option>
          </select>
        </label>

        <label>
          <span>Preferred Travel Season</span>
          <select name="season" value={form.season} onChange={handleChange}>
            <option value="Summer">Summer</option>
            <option value="Monsoon">Monsoon</option>
            <option value="Winter">Winter</option>
            <option value="Any">Any</option>
          </select>
        </label>

        <label>
          <span>Stay Preference</span>
          <select name="accommodation" value={form.accommodation} onChange={handleChange}>
            <option value="Budget stay">Budget stay</option>
            <option value="Comfort stay">Comfort stay</option>
            <option value="Premium stay">Premium stay</option>
            <option value="Homestay">Local homestay</option>
          </select>
        </label>

        <label>
          <span>Trip Pace</span>
          <select name="pace" value={form.pace} onChange={handleChange}>
            <option value="Relaxed">Relaxed</option>
            <option value="Balanced">Balanced</option>
            <option value="Packed">Packed</option>
          </select>
        </label>

        <label>
          <span>Preferred Transport</span>
          <select name="transport" value={form.transport} onChange={handleChange}>
            <option value="Own vehicle">Own vehicle</option>
            <option value="Public transport">Public transport</option>
            <option value="Rental vehicle">Rental vehicle</option>
            <option value="Flight + local travel">Flight + local travel</option>
          </select>
        </label>

        <label>
          <span>Crowd Preference</span>
          <select name="crowdPreference" value={form.crowdPreference} onChange={handleChange}>
            <option value="Prefer low crowd">Prefer low crowd</option>
            <option value="Crowd is okay">Crowd is okay</option>
            <option value="Prefer popular places">Prefer popular places</option>
          </select>
        </label>
      </div>

      <div className="interest-group">
        <span>Interests</span>
        <div className="chip-grid">
          {['Nature', 'History', 'Adventure', 'Food', 'Culture', 'Beaches', 'Wildlife', 'Spiritual'].map((item) => (
            <button
              key={item}
              type="button"
              className={`interest-chip ${form.interests?.includes(item) ? 'selected' : ''}`}
              onClick={() => handleInterestToggle(item)}
              aria-pressed={form.interests?.includes(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error-box" role="alert">{error}</div>}

      <button type="submit" className="primary-btn form-submit" disabled={isSubmitting}>
        <Sparkles size={18} />
        {isSubmitting ? 'Finding trip...' : 'Find My Perfect Trip'}
      </button>
    </form>
  );
}

export default PreferenceForm;
