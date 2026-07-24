const express = require('express');
const { body } = require('express-validator');
const registrationController = require('../controllers/registrationController');
const validateRequest = require('../middleware/validateRequest');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/register',
  protect,
  [body('eventId').notEmpty().withMessage('Event ID is required')],
  validateRequest,
  registrationController.createRegistration
);
router.delete('/register/:id', protect, registrationController.deleteRegistration);
router.get('/my-events', protect, registrationController.getMyEvents);
router.get('/attendees/:eventId', protect, registrationController.getAttendees);

module.exports = router;