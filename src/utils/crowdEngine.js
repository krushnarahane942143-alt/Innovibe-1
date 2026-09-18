import { destinations, destinationMap } from '../data/destinations';

export function getCrowdStatus(destination) {
  if (!destination) {
    return 'LOW';
  }

  if (typeof destination === 'string') {
    const found = destinationMap[destination];
    return found ? found.crowd : 'LOW';
  }

  return destination.crowd || 'LOW';
}

export function getAlternativeDestination(destination) {
  if (!destination) {
    return null;
  }

  const destinationItem = typeof destination === 'string' ? destinationMap[destination] : destination;

  if (!destinationItem) {
    return null;
  }

  const crowdStatus = getCrowdStatus(destinationItem);

  if (crowdStatus !== 'HIGH') {
    return null;
  }

  if (destinationItem.alternative && destinationItem.alternative.id) {
    return destinationMap[destinationItem.alternative.id] || destinationItem.alternative;
  }

  const alternative = destinations.find(
    (item) => item.id !== destinationItem.id && item.crowd === 'LOW' && item.interests.some((interest) => destinationItem.interests.includes(interest))
  );

  return alternative || null;
}
