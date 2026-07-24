const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Event = require('../models/Event');

const seedDemoData = async () => {
  const eventCount = await Event.countDocuments();

  if (eventCount > 0) {
    return;
  }

  let organizer = await User.findOne({ email: 'organizer@example.com' });
  if (!organizer) {
    organizer = await User.create({
      name: 'Demo Organizer',
      email: 'organizer@example.com',
      password: await bcrypt.hash('Password123!', 12),
      role: 'organizer'
    });
  }

  const demoEvents = [
    {
      title: 'Tech Summit 2026',
      description: 'A full-day summit for developers, founders, and product teams.',
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1515169067867-5387ec356754?auto=format&fit=crop&w=1200&q=80',
      organizer: organizer._id,
      date: new Date('2026-08-18T09:00:00.000Z'),
      time: '09:00 AM',
      venue: 'Indira Convention Center',
      city: 'Bengaluru',
      price: 0,
      capacity: 350,
      status: 'approved'
    },
    {
      title: 'Music Under the Stars',
      description: 'An outdoor night concert featuring indie artists and live performances.',
      category: 'Music',
      image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
      organizer: organizer._id,
      date: new Date('2026-08-26T18:30:00.000Z'),
      time: '06:30 PM',
      venue: 'Open Air Arena',
      city: 'Mumbai',
      price: 799,
      capacity: 500,
      status: 'approved'
    },
    {
      title: 'Startup Networking Night',
      description: 'Meet founders, investors, and professionals in an informal networking session.',
      category: 'Business',
      image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80',
      organizer: organizer._id,
      date: new Date('2026-09-03T19:00:00.000Z'),
      time: '07:00 PM',
      venue: 'The Work Hub',
      city: 'Delhi',
      price: 299,
      capacity: 180,
      status: 'approved'
    },
    {
      title: 'Creative Arts Fest',
      description: 'An open festival for painting, photography, and live performances.',
      category: 'Arts',
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
      organizer: organizer._id,
      date: new Date('2026-08-30T10:30:00.000Z'),
      time: '10:30 AM',
      venue: 'City Art Gallery',
      city: 'Hyderabad',
      price: 150,
      capacity: 220,
      status: 'approved'
    }
  ];

  await Event.insertMany(demoEvents);
  console.log('Demo users and events seeded');
};

module.exports = { seedDemoData };