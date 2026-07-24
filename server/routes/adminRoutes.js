const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, authorizeRoles('admin'));

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getUsers);
router.get('/events', adminController.getEvents);
router.get('/registrations', adminController.getRegistrations);
router.get('/attendees/:eventId/export', adminController.exportAttendeesCsv);

module.exports = router;