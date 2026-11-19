const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const AppError = require('../utils/AppError');
const { parsePagination, buildPaginatedResult } = require('../utils/pagination');

function buildDoctorFilter(query) {
  const filter = {};

  if (query.search) {
    const term = query.search.trim();
    if (term) {
      // Prefer text index when available; fall back to regex for partial matches
      filter.$or = [
        { name: { $regex: term, $options: 'i' } },
        { email: { $regex: term, $options: 'i' } },
        { hospital: { $regex: term, $options: 'i' } },
      ];
    }
  }

  if (query.specialization) {
    filter.specialization = query.specialization;
  }

  if (query.hospital) {
    filter.hospital = query.hospital;
  }

  if (query.from || query.to) {
    filter.createdAt = {};
    if (query.from) filter.createdAt.$gte = new Date(query.from);
    if (query.to) {
      const end = new Date(query.to);
      end.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = end;
    }
  }

  return filter;
}

async function listDoctors(query) {
  const { page, limit, skip } = parsePagination(query);
  const filter = buildDoctorFilter(query);

  const [items, total] = await Promise.all([
    Doctor.find(filter)
      .select('name specialization hospital phone email createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Doctor.countDocuments(filter),
  ]);

  return buildPaginatedResult({ items, total, page, limit });
}

async function getDoctorById(id) {
  const doctor = await Doctor.findById(id)
    .select('name specialization hospital phone email createdAt')
    .lean();
  if (!doctor) throw new AppError('Doctor not found', 404);
  return doctor;
}

async function createDoctor(data) {
  const doctor = await Doctor.create(data);
  return doctor.toObject();
}

async function updateDoctor(id, data) {
  const doctor = await Doctor.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .select('name specialization hospital phone email createdAt')
    .lean();
  if (!doctor) throw new AppError('Doctor not found', 404);
  return doctor;
}

async function deleteDoctor(id) {
  const doctor = await Doctor.findById(id);
  if (!doctor) throw new AppError('Doctor not found', 404);

  const patientCount = await Patient.countDocuments({ doctor: id });
  if (patientCount > 0) {
    throw new AppError(
      `Cannot delete doctor with ${patientCount} patient(s). Remove patients first.`,
      400
    );
  }

  await doctor.deleteOne();
  return { id };
}

async function getFilterOptions() {
  const [specializations, hospitals] = await Promise.all([
    Doctor.distinct('specialization'),
    Doctor.distinct('hospital'),
  ]);
  return {
    specializations: specializations.sort(),
    hospitals: hospitals.sort(),
  };
}

module.exports = {
  listDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getFilterOptions,
  buildDoctorFilter,
};
