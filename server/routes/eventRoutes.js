const express = require('express');
const { body } = require('express-validator');
const eventController = require('../controllers/eventController');
const validateRequest = require('../middleware/validateRequest');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);

router.post(
  '/',
  protect,
  upload.single('image'),
  [
    body('title').trim().notEmpty().withMessage('Event title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('time').trim().notEmpty().withMessage('Time is required'),
    body('venue').trim().notEmpty().withMessage('Venue is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1')
  ],
  validateRequest,
  eventController.createEvent
);

router.put(
  '/:id',
  protect,
  upload.single('image'),
  eventController.updateEvent
);

router.delete('/:id', protect, eventController.deleteEvent);
router.patch('/:id/approve', protect, authorizeRoles('admin'), eventController.approveEvent);

module.exports = router;