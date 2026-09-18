import { destinations } from './destinations';

export const itineraries = {
  lonavala: {
    destination: 'Lonavala',
    summary: {
      accommodation: 4500,
      food: 2300,
      transport: 2100,
      activities: 1600,
      total: 10500,
    },
    days: [
      {
        day: 1,
        time: '09:00 AM',
        activity: 'Check-in and easy breakfast near the hill station',
        cost: 600,
        location: 'Lonavala town',
      },
      {
        day: 1,
        time: '11:30 AM',
        activity: 'Explore Karla Caves and a nature trail',
        cost: 900,
        location: 'Karla Caves',
      },
      {
        day: 1,
        time: '06:30 PM',
        activity: 'Sunset point and local café stop',
        cost: 700,
        location: 'Tiger Point',
      },
      {
        day: 2,
        time: '08:30 AM',
        activity: 'Waterfall and viewpoint drive',
        cost: 500,
        location: 'Bhushi Dam',
      },
      {
        day: 2,
        time: '01:00 PM',
        activity: 'Local Maharashtrian lunch and market walk',
        cost: 800,
        location: 'Market area',
      },
      {
        day: 2,
        time: '04:00 PM',
        activity: 'Short trekking route and scenic rest stop',
        cost: 600,
        location: 'Forest trail',
      },
      {
        day: 3,
        time: '09:00 AM',
        activity: 'Heritage walk and local shopping',
        cost: 650,
        location: 'Town market',
      },
      {
        day: 3,
        time: '12:30 PM',
        activity: 'Lunch and return journey planning',
        cost: 700,
        location: 'Local cafe',
      },
    ],
  },
  matheran: {
    destination: 'Matheran',
    summary: {
      accommodation: 3800,
      food: 2200,
      transport: 1800,
      activities: 1500,
      total: 9300,
    },
    days: [
      {
        day: 1,
        time: '09:00 AM',
        activity: 'Arrival, hotel check-in, and forest walk',
        cost: 500,
        location: 'Matheran town',
      },
      {
        day: 1,
        time: '02:00 PM',
        activity: 'Panorama Point and scenic picnic break',
        cost: 700,
        location: 'Panorama Point',
      },
      {
        day: 1,
        time: '06:30 PM',
        activity: 'Sunset view and local dinner',
        cost: 700,
        location: 'Echo Point',
      },
      {
        day: 2,
        time: '07:30 AM',
        activity: 'Nature trail and photography drive',
        cost: 600,
        location: 'Forest route',
      },
      {
        day: 2,
        time: '12:30 PM',
        activity: 'Lunch with local specialties',
        cost: 650,
        location: 'Main market',
      },
      {
        day: 2,
        time: '03:30 PM',
        activity: 'Horse carriage or easy sightseeing ride',
        cost: 800,
        location: 'Town circle',
      },
      {
        day: 3,
        time: '08:30 AM',
        activity: 'Visit Charlotte Lake and local trails',
        cost: 600,
        location: 'Charlotte Lake',
      },
      {
        day: 3,
        time: '01:00 PM',
        activity: 'Shopping and return journey planning',
        cost: 500,
        location: 'Market',
      },
    ],
  },
};

const activityTemplates = {
  Nature: ['Forest walk', 'Scenic viewpoint', 'Nature trail', 'Picnic stop'],
  History: ['Heritage walk', 'Fort visit', 'Architecture tour', 'Museum stop'],
  Adventure: ['Trekking route', 'Adventure activity', 'Trail drive', 'Outdoor challenge'],
  Food: ['Local food tour', 'Cafe break', 'Street food walk', 'Dining stop'],
  Culture: ['Market walk', 'Art and craft stop', 'Local experience', 'Cultural landmark'],
  Beaches: ['Beach stroll', 'Coastal viewpoint', 'Waterfront lunch', 'Sunset walk'],
  Wildlife: ['Safari route', 'Nature reserve visit', 'Birding trail', 'Wildlife viewpoint'],
  Spiritual: ['Temple visit', 'Peaceful spiritual stop', 'Quiet reflection walk', 'Sacred site visit'],
};

const getDestinationFromPreference = (destinationName) => {
  const query = String(destinationName || '').trim().toLowerCase();

  if (!query) {
    return destinations.find((item) => item.id === 'matheran') || destinations[0];
  }

  const match = destinations.find((item) => {
    const haystack = [item.name, item.state, item.category, ...(item.tags || [])]
      .join(' ')
      .toLowerCase();

    return haystack.includes(query) || query.includes(item.name.toLowerCase());
  });

  return match || destinations.find((item) => item.id === 'matheran') || destinations[0];
};

export const getDefaultItinerary = (destinationId = 'matheran') => {
  return itineraries[destinationId] || itineraries.matheran;
};

export const buildItineraryFromPreferences = (preferences = {}) => {
  const destination = getDestinationFromPreference(preferences.destination);
  const baseItinerary = getDefaultItinerary(destination.id);
  const days = Math.max(1, Number(preferences.days) || baseItinerary.days.length);
  const baseDayGroups = baseItinerary.days.reduce((groups, item) => {
    const dayGroup = groups.find((group) => group[0]?.day === item.day);

    if (dayGroup) {
      dayGroup.push(item);
    } else {
      groups.push([item]);
    }

    return groups;
  }, []);
  const interests = Array.isArray(preferences.interests) && preferences.interests.length > 0
    ? preferences.interests
    : ['Nature'];
  const travelType = preferences.travelType || 'Family';
  const crowdPreference = preferences.crowdPreference || 'Prefer low crowd';

  const dayPlans = Array.from({ length: days }, (_, index) => {
    const baseDay = baseDayGroups[index % baseDayGroups.length];
    const interest = interests[index % interests.length] || 'Nature';
    const template = activityTemplates[interest] || activityTemplates.Nature;
    const quietLabel = crowdPreference.toLowerCase().includes('low') ? 'quiet route' : 'popular highlight';
    const travelModeLabel = travelType.toLowerCase() === 'solo'
      ? 'solo exploration'
      : travelType.toLowerCase() === 'couple'
        ? 'couple-friendly stop'
        : travelType.toLowerCase() === 'friends'
          ? 'group-friendly plan'
          : 'family-friendly stop';

    return baseDay.map((stop, stopIndex) => ({
      day: index + 1,
      time: stop.time,
      activity: `${template[stopIndex % template.length]} • ${travelModeLabel} • ${quietLabel}`,
      cost: Math.max(400, Math.round((stop.cost || 600) * (1 + (days > 3 ? 0.18 : 0.05)))),
      location: stop.location,
    }));
  }).flat();

  const accommodation = Math.max(2500, Math.round((Number(preferences.budget) || 15000) * 0.22 / Math.max(days, 1)));
  const food = Math.max(1800, Math.round((Number(preferences.budget) || 15000) * 0.14 / Math.max(days, 1)));
  const transport = Math.max(1200, Math.round((Number(preferences.budget) || 15000) * 0.12 / Math.max(days, 1)));
  const activitiesTotal = dayPlans.reduce((sum, item) => sum + (item.cost || 0), 0);

  return {
    destination: destination.name,
    summary: {
      accommodation,
      food,
      transport,
      activities: activitiesTotal,
      total: accommodation + food + transport + activitiesTotal,
    },
    days: dayPlans,
  };
};
