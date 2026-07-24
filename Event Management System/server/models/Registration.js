const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    ticketNumber: { type: String, required: true, unique: true },
    qrCode: { type: String, required: true }
  },
  { timestamps: { createdAt: 'registrationDate', updatedAt: false } }
);

registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);