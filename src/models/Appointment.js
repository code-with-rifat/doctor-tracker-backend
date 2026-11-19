const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    scheduledAt: { type: Date, required: true },
    reason: { type: String, required: true, trim: true, maxlength: 200 },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

appointmentSchema.index({ scheduledAt: 1, status: 1 });
appointmentSchema.index({ patient: 1, scheduledAt: -1 });
appointmentSchema.index({ doctor: 1, scheduledAt: -1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
