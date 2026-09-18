import { destinations } from '../data/destinations';

const normalizeBudget = (budget) => {
  if (!budget || Number.isNaN(Number(budget))) {
    return 15000;
  }

  return Number(budget);
};

const getTravelTypeWeight = (travelType) => {
  const map = {
    Solo: 10,
    Couple: 10,
    Family: 10,
    Friends: 10,
  };

  return map[travelType] || 7;
};

export function getRecommendations(preferences = {}) {
  const safePreferences = {
    destination: '',
    days: 3,
    budget: 15000,
    travelers: 2,
    travelType: 'Family',
    interests: [],
    season: 'Any',
    ...preferences,
  };

  const normalizedBudget = normalizeBudget(safePreferences.budget);
  const preferredInterests = Array.isArray(safePreferences.interests)
    ? safePreferences.interests
    : [safePreferences.interests].filter(Boolean);

  const scoredDestinations = destinations
    .map((destination) => {
      let score = 0;
      const interestMatches = (destination.interests || []).filter((interest) =>
        preferredInterests.includes(interest)
      );

      if (interestMatches.length > 0) {
        score += 30 + interestMatches.length * 8;
      }

      if (normalizedBudget >= Number(destination.estimatedCost)) {
        score += 20;
      } else if (normalizedBudget >= Number(destination.estimatedCost) * 0.8) {
        score += 10;
      }

      if (safePreferences.days >= 3 && safePreferences.days <= 5) {
        score += 20;
      } else if (safePreferences.days > 5) {
        score += 8;
      }

      if (destination.travelTypeSuitability && destination.travelTypeSuitability[safePreferences.travelType] !== undefined) {
        score += destination.travelTypeSuitability[safePreferences.travelType] / 10;
      }

      if ((destination.crowd || 'MEDIUM') === 'LOW') {
        score += 10;
      } else if ((destination.crowd || 'MEDIUM') === 'MEDIUM') {
        score += 5;
      }

      score += getTravelTypeWeight(safePreferences.travelType);
      score += 10;

      if (safePreferences.destination && destination.region && destination.region.toLowerCase().includes(safePreferences.destination.toLowerCase())) {
        score += 8;
      }

      const matchPercent = Math.min(99, Math.max(70, Math.round(score)));

      return {
        ...destination,
        matchPercent,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);

  return scoredDestinations;
}
