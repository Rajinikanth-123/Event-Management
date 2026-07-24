const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const toCsv = require('../utils/csv');

const getDashboard = asyncHandler(async (req, res) => {
  const [totalUsers, totalEvents, totalRegistrations] = await Promise.all([
    User.countDocuments(),
    Event.countDocuments(),
    Registration.countDocuments()
  ]);

  const revenueAggregation = await Event.aggregate([
    {
      $lookup: {
        from: 'registrations',
        localField: '_id',
        foreignField: 'eventId',
        as: 'registrations'
      }
    },
    {
      $project: {
        revenue: { $multiply: [{ $size: '$registrations' }, '$price'] }
      }
    },
    {
      $group: {
        _id: null,
        revenue: { $sum: '$revenue' }
      }
    }
  ]);

  const recentRegistrations = await Registration.find()
    .populate('userId', 'name email profileImage')
    .populate({
      path: 'eventId',
      populate: { path: 'organizer', select: 'name email profileImage' }
    })
    .sort({ registrationDate: -1 })
    .limit(6);

  const recentEvents = await Event.find()
    .populate('organizer', 'name email profileImage')
    .sort({ createdAt: -1 })
    .limit(6);

  const usersByRole = await User.aggregate([{ $group: { _id: '$role', total: { $sum: 1 } } }]);
  const eventsByCity = await Event.aggregate([{ $group: { _id: '$city', total: { $sum: 1 } } }, { $sort: { total: -1 } }, { $limit: 6 }]);

  res.json({
    success: true,
    dashboard: {
      totalUsers,
      totalEvents,
      totalRegistrations,
      revenue: revenueAggregation[0]?.revenue || 0,
      recentRegistrations,
      recentEvents,
      usersByRole,
      eventsByCity
    }
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, users });
});

const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find().populate('organizer', 'name email profileImage role').sort({ createdAt: -1 });
  res.json({ success: true, events });
});

const getRegistrations = asyncHandler(async (req, res) => {
  const registrations = await Registration.find()
    .populate('userId', 'name email profileImage phone')
    .populate({
      path: 'eventId',
      populate: { path: 'organizer', select: 'name email profileImage role' }
    })
    .sort({ registrationDate: -1 });

  res.json({ success: true, registrations });
});

const exportAttendeesCsv = asyncHandler(async (req, res) => {
  const registrations = await Registration.find({ eventId: req.params.eventId })
    .populate('userId', 'name email phone')
    .populate('eventId', 'title date venue city');

  const rows = registrations.map((registration) => ({
    ticketNumber: registration.ticketNumber,
    attendeeName: registration.userId?.name || '',
    attendeeEmail: registration.userId?.email || '',
    attendeePhone: registration.userId?.phone || '',
    event: registration.eventId?.title || '',
    date: registration.eventId?.date || '',
    venue: registration.eventId?.venue || '',
    city: registration.eventId?.city || '',
    registeredAt: registration.registrationDate
  }));

  const csv = toCsv(rows);
  res.header('Content-Type', 'text/csv');
  res.attachment(`attendees-${req.params.eventId}.csv`);
  res.send(csv);
});

module.exports = {
  getDashboard,
  getUsers,
  getEvents,
  getRegistrations,
  exportAttendeesCsv
};