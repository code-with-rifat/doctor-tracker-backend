const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const AppError = require('../utils/AppError');
const { parsePagination, buildPaginatedResult } = require('../utils/pagination');

const detailPopulate = [
  { path: 'patient', select: 'name phone condition status' },
  { path: 'doctor', select: 'name specialization hospital' },
];

function buildFilter(query) {
  const filter = {};

  if (query.status) filter.status = query.status;
  if (query.doctor) filter.doctor = query.doctor;
  if (query.patient) filter.patient = query.patient;

  if (query.search) {
    const term = query.search.trim();
    if (term) filter.reason = { $regex: term, $options: 'i' };
  }

  if (query.from || query.to) {
    filter.scheduledAt = {};
    if (query.from) filter.scheduledAt.$gte = new Date(query.from);
    if (query.to) {
      const end = new Date(query.to);
      end.setHours(23, 59, 59, 999);
      filter.scheduledAt.$lte = end;
    }
  }

  return filter;
}

async function assertLinks(data) {
  const [patient, doctor] = await Promise.all([
    Patient.findById(data.patient).select('_id').lean(),
    Doctor.findById(data.doctor).select('_id').lean(),
  ]);
  if (!patient) throw new AppError('Patient not found', 404);
  if (!doctor) throw new AppError('Doctor not found', 404);
}

async function listAppointments(query) {
  const { page, limit, skip } = parsePagination(query);
  const filter = buildFilter(query);

  const [items, total] = await Promise.all([
    Appointment.find(filter)
      .populate(detailPopulate)
      .sort({ scheduledAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Appointment.countDocuments(filter),
  ]);

  return buildPaginatedResult({ items, total, page, limit });
}

async function createAppointment(data) {
  await assertLinks(data);
  const when = new Date(data.scheduledAt);
  if (Number.isNaN(when.getTime())) throw new AppError('Enter a valid date and time', 400);

  const created = await Appointment.create({
    ...data,
    scheduledAt: when,
    status: data.status || 'Scheduled',
  });

  return Appointment.findById(created._id).populate(detailPopulate).lean();
}

async function updateAppointment(id, data) {
  await assertLinks(data);
  const when = new Date(data.scheduledAt);
  if (Number.isNaN(when.getTime())) throw new AppError('Enter a valid date and time', 400);

  const appointment = await Appointment.findByIdAndUpdate(
    id,
    { ...data, scheduledAt: when },
    { new: true, runValidators: true }
  )
    .populate(detailPopulate)
    .lean();

  if (!appointment) throw new AppError('Appointment not found', 404);
  return appointment;
}

async function deleteAppointment(id) {
  const appointment = await Appointment.findByIdAndDelete(id).lean();
  if (!appointment) throw new AppError('Appointment not found', 404);
  return { id };
}

async function countUpcoming() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return Appointment.countDocuments({
    status: 'Scheduled',
    scheduledAt: { $gte: start },
  });
}

module.exports = {
  listAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  countUpcoming,
};
