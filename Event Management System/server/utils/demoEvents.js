const demoEvents = [
  {
    _id: 'demo-event-1',
    title: 'Tech Summit 2026',
    description: 'A full-day summit for developers, founders, and product teams.',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1515169067867-5387ec356754?auto=format&fit=crop&w=1200&q=80',
    organizer: {
      _id: 'demo-organizer-1',
      name: 'Aarav Mehta',
      email: 'aarav@example.com',
      role: 'organizer',
      profileImage: ''
    },
    date: '2026-08-18T09:00:00.000Z',
    time: '09:00 AM',
    venue: 'Indira Convention Center',
    city: 'Bengaluru',
    price: 0,
    capacity: 350,
    registeredUsers: [],
    registeredCount: 128,
    availableSeats: 222,
    status: 'approved',
    createdAt: '2026-07-10T10:00:00.000Z'
  },
  {
    _id: 'demo-event-2',
    title: 'Music Under the Stars',
    description: 'An outdoor night concert featuring indie artists and live performances.',
    category: 'Music',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    organizer: {
      _id: 'demo-organizer-2',
      name: 'Sara Khan',
      email: 'sara@example.com',
      role: 'organizer',
      profileImage: ''
    },
    date: '2026-08-26T18:30:00.000Z',
    time: '06:30 PM',
    venue: 'Open Air Arena',
    city: 'Mumbai',
    price: 799,
    capacity: 500,
    registeredUsers: [],
    registeredCount: 264,
    availableSeats: 236,
    status: 'approved',
    createdAt: '2026-07-11T12:00:00.000Z'
  },
  {
    _id: 'demo-event-3',
    title: 'Startup Networking Night',
    description: 'Meet founders, investors, and professionals in an informal networking session.',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80',
    organizer: {
      _id: 'demo-organizer-3',
      name: 'Neha Verma',
      email: 'neha@example.com',
      role: 'organizer',
      profileImage: ''
    },
    date: '2026-09-03T19:00:00.000Z',
    time: '07:00 PM',
    venue: 'The Work Hub',
    city: 'Delhi',
    price: 299,
    capacity: 180,
    registeredUsers: [],
    registeredCount: 95,
    availableSeats: 85,
    status: 'approved',
    createdAt: '2026-07-12T09:30:00.000Z'
  },
  {
    _id: 'demo-event-4',
    title: 'Creative Arts Fest',
    description: 'An open festival for painting, photography, and live performances.',
    category: 'Arts',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
    organizer: {
      _id: 'demo-organizer-4',
      name: 'Riya Sharma',
      email: 'riya@example.com',
      role: 'organizer',
      profileImage: ''
    },
    date: '2026-08-30T10:30:00.000Z',
    time: '10:30 AM',
    venue: 'City Art Gallery',
    city: 'Hyderabad',
    price: 150,
    capacity: 220,
    registeredUsers: [],
    registeredCount: 74,
    availableSeats: 146,
    status: 'approved',
    createdAt: '2026-07-13T08:15:00.000Z'
  }
];

const getDemoEvents = () => demoEvents.map((event) => ({ ...event }));

module.exports = { getDemoEvents };