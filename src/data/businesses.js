export const businesses = [
  {
    id: 'hotel-1',
    name: 'Valley View Stay',
    category: 'Hotel',
    rating: 4.8,
    priceRange: '₹2,200/night',
    location: 'Lonavala',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
    description: 'Comfortable stay with mountain views, family rooms, and local breakfast.',
  },
  {
    id: 'hotel-2',
    name: 'Matheran Eco Lodge',
    category: 'Homestay',
    rating: 4.7,
    priceRange: '₹1,800/night',
    location: 'Matheran',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    description: 'Quiet, eco-friendly property surrounded by forest trails and scenic views.',
  },
  {
    id: 'restaurant-1',
    name: 'Pinewood Bistro',
    category: 'Restaurant',
    rating: 4.9,
    priceRange: '₹600/person',
    location: 'Mahabaleshwar',
    image:
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80',
    description: 'Known for local Maharashtrian plates, fresh berries, and scenic balcony seating.',
  },
  {
    id: 'restaurant-2',
    name: 'Sunset Spice House',
    category: 'Restaurant',
    rating: 4.8,
    priceRange: '₹500/person',
    location: 'Goa',
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
    description: 'Serves coastal cuisine and seafood specialities preferred by travelers and families.',
  },
  {
    id: 'guide-1',
    name: 'Aditi Heritage Trails',
    category: 'Local Guide',
    rating: 4.9,
    priceRange: '₹1,500/day',
    location: 'Jaipur',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    description: 'Expert local storyteller guiding heritage walks and hidden culinary stops.',
  },
  {
    id: 'experience-1',
    name: 'Forest Trek Sessions',
    category: 'Local Experience',
    rating: 4.7,
    priceRange: '₹1,200/person',
    location: 'Matheran',
    image:
      'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=80',
    description: 'Guided nature walks and viewpoint trails curated for families and beginners.',
  },
  {
    id: 'homestay-1',
    name: 'Saffron Courtyard',
    category: 'Homestay',
    rating: 4.8,
    priceRange: '₹2,500/night',
    location: 'Jaipur',
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    description: 'Traditional Rajasthani hospitality with handcrafted decor and home-cooked meals.',
  },
  {
    id: 'hotel-3',
    name: 'Silver Peaks Resort',
    category: 'Hotel',
    rating: 4.6,
    priceRange: '₹3,500/night',
    location: 'Manali',
    image:
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=900&q=80',
    description: 'Mountain resort with spacious family suites and guided winter adventure support.',
  },
];

export const businessGroups = {
  Hotels: businesses.filter((item) => item.category === 'Hotel'),
  Restaurants: businesses.filter((item) => item.category === 'Restaurant'),
  'Local Guides': businesses.filter((item) => item.category === 'Local Guide'),
  Homestays: businesses.filter((item) => item.category === 'Homestay'),
  'Local Experiences': businesses.filter((item) => item.category === 'Local Experience'),
};
