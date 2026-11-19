const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0, max: 130 },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other'],
    },
    phone: { type: String, required: true, trim: true },
    condition: { type: String, required: true, trim: true },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

// Lookup patients belonging to a doctor (detail page, cascade checks)
patientSchema.index({ doctor: 1, createdAt: -1 });

// Filter by condition with recent-first listing
patientSchema.index({ condition: 1, createdAt: -1 });

// Dashboard time-series and date-range filters
patientSchema.index({ createdAt: -1 });

// Text search on patient name and phone
patientSchema.index({ name: 'text', phone: 'text' });

module.exports = mongoose.model('Patient', patientSchema);
