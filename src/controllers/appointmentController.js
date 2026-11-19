const asyncHandler = require('../utils/asyncHandler');
const appointmentService = require('../services/appointmentService');

const list = asyncHandler(async (req, res) => {
  const result = await appointmentService.listAppointments(req.query);
  res.json(result);
});

const create = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.createAppointment(req.body);
  res.status(201).json({ message: 'Appointment created', data: appointment });
});

const update = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.updateAppointment(req.params.id, req.body);
  res.json({ message: 'Appointment updated', data: appointment });
});

const remove = asyncHandler(async (req, res) => {
  await appointmentService.deleteAppointment(req.params.id);
  res.json({ message: 'Appointment deleted' });
});

module.exports = { list, create, update, remove };
