const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { isDBConnected } = require('../config/db');
const { getDemoEvents } = require('../utils/demoEvents');

const populateEvent = (query) => query.populate('organizer', 'name email profileImage role');

const normalizeDemoEvent = (event) => ({
  ...event,
  registeredUsers: event.registeredUsers || [],
  registeredCount: event.registeredCount ?? (event.registeredUsers || []).length,
  availableSeats: event.availableSeats ?? Math.max((event.capacity || 0) - (event.registeredCount ?? (event.registeredUsers || []).length), 0)
});

const matchesText = (value, search) => String(value || '').toLowerCase().includes(String(search || '').toLowerCase());

const filterDemoEvents = (events, query) => {
  let filtered = [...events];

  if (query.keyword) {
    filtered = filtered.filter((event) =>
      ['title', 'description', 'city', 'venue'].some((field) => matchesText(event[field], query.keyword))
    );
  }

  if (query.category) filtered = filtered.filter((event) => event.category === query.category);
  if (query.city) filtered = filtered.filter((event) => matchesText(event.city, query.city));
  if (query.price === 'free') filtered = filtered.filter((event) => Number(event.price) === 0);
  if (query.price === 'paid') filtered = filtered.filter((event) => Number(event.price) > 0);
  if (query.status) filtered = filtered.filter((event) => event.status === query.status);

  if (query.dateFilter === 'upcoming') {
    const now = new Date();
    filtered = filtered.filter((event) => new Date(event.date) >= now);
  }

  if (query.dateFilter === 'past') {
    const now = new Date();
    filtered = filtered.filter((event) => new Date(event.date) < now);
  }

  if (query.date) {
    const day = new Date(query.date);
    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    filtered = filtered.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= day && eventDate < nextDay;
    });
  }

  if (query.mine === 'true' && query.userId) {
    filtered = filtered.filter((event) => event.organizer?._id === query.userId);
  }

  if (query.organizer && query.organizer !== 'me') {
    filtered = filtered.filter((event) => event.organizer?._id === query.organizer);
  }

  return filtered;
};

const sortDemoEvents = (events, sortBy) => {
  const sorted = [...events];

  const sorters = {
    newest: (a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date),
    oldest: (a, b) => new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date),
    popular: (a, b) => (b.registeredCount || 0) - (a.registeredCount || 0),
    priceAsc: (a, b) => Number(a.price || 0) - Number(b.price || 0),
    priceDesc: (a, b) => Number(b.price || 0) - Number(a.price || 0)
  };

  sorted.sort(sorters[sortBy] || sorters.newest);
  return sorted;
};

const buildQuery = (query) => {
  const filter = {};

  if (query.keyword) {
    filter.$or = [
      { title: { $regex: query.keyword, $options: 'i' } },
      { description: { $regex: query.keyword, $options: 'i' } },
      { city: { $regex: query.keyword, $options: 'i' } },
      { venue: { $regex: query.keyword, $options: 'i' } }
    ];
  }

  if (query.category) filter.category = query.category;
  if (query.city) filter.city = { $regex: query.city, $options: 'i' };
  if (query.organizer && query.organizer !== 'me') filter.organizer = query.organizer;
  if (query.mine === 'true') filter.organizer = query.userId;

  if (query.price === 'free') filter.price = 0;
  if (query.price === 'paid') filter.price = { $gt: 0 };
  if (query.status) filter.status = query.status;

  if (query.dateFilter === 'upcoming') filter.date = { $gte: new Date() };
  if (query.dateFilter === 'past') filter.date = { $lt: new Date() };

  if (query.date) {
    const day = new Date(query.date);
    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    filter.date = { $gte: day, $lt: nextDay };
  }

  return filter;
};

const getEvents = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;
  const sortBy = req.query.sortBy || 'newest';

  if (!isDBConnected()) {
    const filteredEvents = filterDemoEvents(getDemoEvents(), { ...req.query, userId: req.user?._id?.toString() });
    const demoEvents = sortDemoEvents(filteredEvents, sortBy).slice(skip, skip + limit).map(normalizeDemoEvent);

    return res.json({
      success: true,
      events: demoEvents,
      pagination: {
        page,
        limit,
        total: filteredEvents.length,
        pages: Math.ceil(filteredEvents.length / limit)
      }
    });
  }

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    popular: { registeredCount: -1 },
    priceAsc: { price: 1 },
    priceDesc: { price: -1 }
  };

  const baseFilter = buildQuery({ ...req.query, userId: req.user?._id?.toString() });

  const pipeline = [
    { $match: baseFilter },
    {
      $addFields: {
        registeredCount: { $size: { $ifNull: ['$registeredUsers', []] } },
        availableSeats: { $subtract: ['$capacity', { $size: { $ifNull: ['$registeredUsers', []] } }] }
      }
    },
    { $sort: sortMap[sortBy] || sortMap.newest },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        let: { organizerId: '$organizer' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_id', '$$organizerId'] }
            }
          },
          {
            $project: {
              name: 1,
              email: 1,
              profileImage: 1,
              role: 1
            }
          }
        ],
        as: 'organizer'
      }
    },
    { $unwind: '$organizer' }
  ];

  const events = await Event.aggregate(pipeline);
  const countPipeline = [
    { $match: baseFilter },
    { $count: 'total' }
  ];
  const totalResult = await Event.aggregate(countPipeline);
  const total = totalResult[0]?.total || 0;

  res.json({
    success: true,
    events,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

const getEventById = asyncHandler(async (req, res) => {
  if (!isDBConnected()) {
    const event = getDemoEvents().find((item) => item._id === req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    return res.json({ success: true, event: normalizeDemoEvent(event) });
  }

  const event = await populateEvent(Event.findById(req.params.id));
  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  const registeredCount = await Registration.countDocuments({ eventId: event._id });
  res.json({
    success: true,
    event: {
      ...event.toObject(),
      registeredCount,
      availableSeats: event.capacity - registeredCount
    }
  });
});

const createEvent = asyncHandler(async (req, res) => {
  if (!isDBConnected()) {
    return res.status(503).json({ success: false, message: 'Database is unavailable. Event creation is disabled in demo mode.' });
  }

  const payload = {
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    organizer: req.user._id,
    date: req.body.date,
    time: req.body.time,
    venue: req.body.venue,
    city: req.body.city,
    price: req.body.price || 0,
    capacity: req.body.capacity,
    status: req.user.role === 'admin' ? 'approved' : 'pending'
  };

  if (req.file) {
    payload.image = `/uploads/${req.file.filename}`;
  }

  const event = await Event.create(payload);
  const populatedEvent = await populateEvent(Event.findById(event._id));

  res.status(201).json({ success: true, message: 'Event created successfully', event: populatedEvent });
});

const updateEvent = asyncHandler(async (req, res) => {
  if (!isDBConnected()) {
    return res.status(503).json({ success: false, message: 'Database is unavailable. Event updates are disabled in demo mode.' });
  }

  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  const isOwner = event.organizer.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not allowed to update this event' });
  }

  const fields = ['title', 'description', 'category', 'date', 'time', 'venue', 'city', 'price', 'capacity', 'status'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      event[field] = req.body[field];
    }
  });

  if (req.file) {
    event.image = `/uploads/${req.file.filename}`;
  }

  await event.save();
  const updatedEvent = await populateEvent(Event.findById(event._id));

  res.json({ success: true, message: 'Event updated successfully', event: updatedEvent });
});

const deleteEvent = asyncHandler(async (req, res) => {
  if (!isDBConnected()) {
    return res.status(503).json({ success: false, message: 'Database is unavailable. Event deletion is disabled in demo mode.' });
  }

  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  const isOwner = event.organizer.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not allowed to delete this event' });
  }

  await Registration.deleteMany({ eventId: event._id });
  await event.deleteOne();
  res.json({ success: true, message: 'Event deleted successfully' });
});

const approveEvent = asyncHandler(async (req, res) => {
  if (!isDBConnected()) {
    return res.status(503).json({ success: false, message: 'Database is unavailable. Event approval is disabled in demo mode.' });
  }

  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  event.status = 'approved';
  await event.save();
  const approvedEvent = await populateEvent(Event.findById(event._id));

  res.json({ success: true, message: 'Event approved successfully', event: approvedEvent });
});

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  approveEvent
};