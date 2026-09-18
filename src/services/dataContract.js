const CROWD_VALUES = ['LOW', 'MEDIUM', 'HIGH'];

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const normalizeCrowd = (crowd) => {
  const value = String(crowd || 'MEDIUM').toUpperCase();
  return CROWD_VALUES.includes(value) ? value : 'MEDIUM';
};

const normalizeAlternative = (alternative) => {
  if (!alternative) {
    return null;
  }

  return {
    id: alternative.id,
    name: alternative.name || '',
    state: alternative.state || '',
    image: alternative.image || '',
    description: alternative.description || '',
    category: alternative.category || '',
    interests: Array.isArray(alternative.interests) ? alternative.interests : [],
    estimatedCost: toNumber(alternative.estimatedCost),
    crowd: normalizeCrowd(alternative.crowd || 'LOW'),
    matchScore: toNumber(alternative.matchScore),
    bestTime: alternative.bestTime || '',
    distance: alternative.distance || '',
    attractions: Array.isArray(alternative.attractions) ? alternative.attractions : [],
    tags: Array.isArray(alternative.tags) ? alternative.tags : [],
  };
};

export function normalizeDestination(destination) {
  return {
    ...destination,
    id: destination.id,
    name: destination.name || '',
    state: destination.state || '',
    image: destination.image || '',
    description: destination.description || '',
    category: destination.category || '',
    interests: Array.isArray(destination.interests) ? destination.interests : [],
    estimatedCost: toNumber(destination.estimatedCost),
    crowd: normalizeCrowd(destination.crowd),
    matchScore: toNumber(destination.matchScore),
    matchPercent: destination.matchPercent === undefined ? undefined : toNumber(destination.matchPercent),
    bestTime: destination.bestTime || '',
    distance: destination.distance || '',
    attractions: Array.isArray(destination.attractions) ? destination.attractions : [],
    tags: Array.isArray(destination.tags) ? destination.tags : [],
    alternative: normalizeAlternative(destination.alternative),
  };
}

export function normalizeBusiness(business) {
  return {
    ...business,
    id: business.id,
    name: business.name || '',
    category: business.category || '',
    rating: toNumber(business.rating),
    priceRange: business.priceRange || '',
    location: business.location || '',
    image: business.image || '',
    description: business.description || '',
  };
}

export function normalizeItinerary(itinerary) {
  return {
    ...itinerary,
    destination: itinerary.destination || '',
    summary: {
      accommodation: toNumber(itinerary.summary?.accommodation),
      food: toNumber(itinerary.summary?.food),
      transport: toNumber(itinerary.summary?.transport),
      activities: toNumber(itinerary.summary?.activities),
      total: toNumber(itinerary.summary?.total),
    },
    days: Array.isArray(itinerary.days)
      ? itinerary.days.map((item) => ({
          day: toNumber(item.day),
          time: item.time || '',
          activity: item.activity || '',
          cost: toNumber(item.cost),
          location: item.location || '',
        }))
      : [],
  };
}

export function normalizePreferences(preferences = {}) {
  return {
    destination: String(preferences.destination || '').trim(),
    days: toNumber(preferences.days, 3),
    budget: toNumber(preferences.budget, 15000),
    travelers: toNumber(preferences.travelers, 2),
    travelType: preferences.travelType || 'Family',
    interests: Array.isArray(preferences.interests) ? preferences.interests : [],
    season: preferences.season || 'Any',
    accommodation: preferences.accommodation || 'Comfort stay',
    pace: preferences.pace || 'Balanced',
    transport: preferences.transport || 'Own vehicle',
    crowdPreference: preferences.crowdPreference || 'Prefer low crowd',
  };
}

export const formatCurrency = (value) => `₹${toNumber(value).toLocaleString('en-IN')}`;