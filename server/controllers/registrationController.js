const QRCode = require('qrcode');
const asyncHandler = require('../middleware/asyncHandler');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const generateTicketNumber = require('../utils/generateTicketNumber');
const sendEmail = require('../utils/mailer');
const { buildRegistrationEmail } = require('../utils/emailTemplates');

const createRegistration = asyncHandler(async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user._id;

  if (!eventId) {
    return res.status(400).json({ success: false, message: 'Event ID is required' });
  }

  const event = await Event.findById(eventId).populate('organizer', 'name email profileImage role');
  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  if (event.status !== 'approved' && req.user.role !== 'admin' && event.organizer._id.toString() !== userId.toString()) {
    return res.status(400).json({ success: false, message: 'Event is not available for registration yet' });
  }

  const existingRegistration = await Registration.findOne({ userId, eventId });
  if (existingRegistration) {
    return res.status(400).json({ success: false, message: 'You are already registered for this event' });
  }

  const registrationsCount = await Registration.countDocuments({ eventId });
  if (registrationsCount >= event.capacity) {
    return res.status(400).json({ success: false, message: 'Event is sold out' });
  }

  const ticketNumber = generateTicketNumber();
  const qrPayload = {
    ticketNumber,
    eventId: event._id.toString(),
    userId: userId.toString(),
    title: event.title,
    date: event.date,
    venue: event.venue
  };
  const qrCode = await QRCode.toDataURL(JSON.stringify(qrPayload));

  const registration = await Registration.create({
    userId,
    eventId,
    ticketNumber,
    qrCode
  });

  event.registeredUsers.push(userId);
  await event.save();

  await sendEmail({
    to: req.user.email,
    subject: `Registration confirmed for ${event.title}`,
    html: buildRegistrationEmail({
      appName: process.env.APP_NAME || 'Event Management System',
      event,
      ticketNumber,
      qrCode,
      attendeeName: req.user.name
    })
  });

  const populatedRegistration = await Registration.findById(registration._id)
    .populate('userId', 'name email profileImage phone')
    .populate({
      path: 'eventId',
      populate: { path: 'organizer', select: 'name email profileImage role' }
    });

  res.status(201).json({
    success: true,
    message: 'Registration completed successfully',
    registration: populatedRegistration
  });
});

const deleteRegistration = asyncHandler(async (req, res) => {
  const registration = await Registration.findById(req.params.id).populate('eventId');
  if (!registration) {
    return res.status(404).json({ success: false, message: 'Registration not found' });
  }

  const isOwner = registration.userId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  const isOrganizer = registration.eventId.organizer.toString() === req.user._id.toString();

  if (!isOwner && !isAdmin && !isOrganizer) {
    return res.status(403).json({ success: false, message: 'Not allowed to delete this registration' });
  }

  await Event.findByIdAndUpdate(registration.eventId._id, {
    $pull: { registeredUsers: registration.userId }
  });
  await registration.deleteOne();

  res.json({ success: true, message: 'Registration removed successfully' });
});

const getMyEvents = asyncHandler(async (req, res) => {
  const registrations = await Registration.find({ userId: req.user._id })
    .populate('eventId')
    .populate('userId', 'name email profileImage')
    .sort({ registrationDate: -1 });

  res.json({ success: true, registrations });
});

const getAttendees = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.eventId);
  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  const canView = req.user.role === 'admin' || event.organizer.toString() === req.user._id.toString();
  if (!canView) {
    return res.status(403).json({ success: false, message: 'Not allowed to view attendees' });
  }

  const registrations = await Registration.find({ eventId: event._id })
    .populate('userId', 'name email profileImage phone')
    .sort({ registrationDate: -1 });

  res.json({ success: true, registrations, event });
});

module.exports = {
  createRegistration,
  deleteRegistration,
  getMyEvents,
  getAttendees
};