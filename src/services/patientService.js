const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const AppError = require('../utils/AppError');
const { parsePagination, buildPaginatedResult } = require('../utils/pagination');

function buildPatientFilter(query) {
  const filter = {};

  if (query.search) {
    const term = query.search.trim();
    if (term) {
      filter.$or = [
        { name: { $regex: term, $options: 'i' } },
        { phone: { $regex: term, $options: 'i' } },
        { condition: { $regex: term, $options: 'i' } },
      ];
    }
  }

  if (query.condition) {
    filter.condition = query.condition;
  }

  if (query.doctor) {
    filter.doctor = query.doctor;
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

async function listPatients(query) {
  const { page, limit, skip } = parsePagination(query);
  const filter = buildPatientFilter(query);

  const [items, total] = await Promise.all([
    Patient.find(filter)
      .select('name age gender phone condition doctor createdAt')
      .populate('doctor', 'name specialization hospital')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Patient.countDocuments(filter),
  ]);

  return buildPaginatedResult({ items, total, page, limit });
}

async function listPatientsByDoctor(doctorId, query) {
  const doctor = await Doctor.findById(doctorId).select('_id').lean();
  if (!doctor) throw new AppError('Doctor not found', 404);

  return listPatients({ ...query, doctor: doctorId });
}

async function getPatientById(id) {
  const patient = await Patient.findById(id)
    .select('name age gender phone condition doctor createdAt')
    .populate('doctor', 'name specialization hospital')
    .lean();
  if (!patient) throw new AppError('Patient not found', 404);
  return patient;
}

async function createPatient(data) {
  const doctor = await Doctor.findById(data.doctor).select('_id').lean();
  if (!doctor) throw new AppError('Doctor not found', 404);

  const patient = await Patient.create(data);
  return Patient.findById(patient._id)
    .select('name age gender phone condition doctor createdAt')
    .populate('doctor', 'name specialization hospital')
    .lean();
}

async function updatePatient(id, data) {
  if (data.doctor) {
    const doctor = await Doctor.findById(data.doctor).select('_id').lean();
    if (!doctor) throw new AppError('Doctor not found', 404);
  }

  const patient = await Patient.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .select('name age gender phone condition doctor createdAt')
    .populate('doctor', 'name specialization hospital')
    .lean();

  if (!patient) throw new AppError('Patient not found', 404);
  return patient;
}

async function deletePatient(id) {
  const patient = await Patient.findByIdAndDelete(id).lean();
  if (!patient) throw new AppError('Patient not found', 404);
  return { id };
}

async function getFilterOptions() {
  const [conditions, doctors] = await Promise.all([
    Patient.distinct('condition'),
    Doctor.find().select('name').sort({ name: 1 }).lean(),
  ]);
  return {
    conditions: conditions.sort(),
    doctors,
  };
}

module.exports = {
  listPatients,
  listPatientsByDoctor,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getFilterOptions,
};
