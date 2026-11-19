const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    hospital: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

// Text index for search across name, email, hospital
doctorSchema.index({ name: 'text', email: 'text', hospital: 'text' });

// Filter + sort by specialization and createdAt together
doctorSchema.index({ specialization: 1, createdAt: -1 });

// Filter by hospital with recent-first listing
doctorSchema.index({ hospital: 1, createdAt: -1 });

// Date-range queries on doctor creation
doctorSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Doctor', doctorSchema);
