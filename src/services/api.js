import { destinations } from '../data/destinations';
import { businesses } from '../data/businesses';
import { getDefaultItinerary } from '../data/itineraries';
import { getRecommendations } from '../utils/recommendationEngine';
import { getCrowdStatus, getAlternativeDestination } from '../utils/crowdEngine';
import {
  normalizeBusiness,
  normalizeDestination,
  normalizeItinerary,
  normalizePreferences,
} from './dataContract';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export function getDestinations() {
  if (API_BASE_URL) {
    return requestJson('/destinations').then((items) => items.map(normalizeDestination));
  }

  return Promise.resolve(destinations.map(normalizeDestination));
}

export function getRecommendationsApi(preferences) {
  const payload = normalizePreferences(preferences);

  if (API_BASE_URL) {
    return requestJson('/recommend', {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then((items) => items.map(normalizeDestination));
  }

  return Promise.resolve(getRecommendations(payload).map(normalizeDestination));
}

export function getCrowdStatusApi(destinationId) {
  if (API_BASE_URL) {
    return requestJson(`/crowd/${destinationId}`);
  }

  const destination = destinations.find((item) => item.id === destinationId);
  return Promise.resolve({ destinationId, status: getCrowdStatus(destination) });
}

export function getAlternativeDestinationApi(destinationId) {
  if (API_BASE_URL) {
    return requestJson(`/alternatives/${destinationId}`).then((result) => ({
      ...result,
      alternative: result.alternative ? normalizeDestination(result.alternative) : null,
    }));
  }

  const destination = destinations.find((item) => item.id === destinationId);
  const alternative = getAlternativeDestination(destination);
  return Promise.resolve({
    destinationId,
    alternative: alternative ? normalizeDestination(alternative) : null,
  });
}

export function generateItinerary(preferences) {
  const payload = normalizePreferences(preferences);
  const requestPayload = {
    ...payload,
    destinationId: preferences?.destinationId || 'matheran',
  };

  if (API_BASE_URL) {
    return requestJson('/generate-itinerary', {
      method: 'POST',
      body: JSON.stringify(requestPayload),
    }).then(normalizeItinerary);
  }

  const destinationId = preferences?.destinationId || 'matheran';
  return Promise.resolve(normalizeItinerary(getDefaultItinerary(destinationId)));
}

export function getBusinesses() {
  if (API_BASE_URL) {
    return requestJson('/businesses').then((items) => items.map(normalizeBusiness));
  }

  return Promise.resolve(businesses.map(normalizeBusiness));
}
