const asyncHandler = require('../utils/asyncHandler');
const patientService = require('../services/patientService');

const list = asyncHandler(async (req, res) => {
  const result = await patientService.listPatients(req.query);
  res.json(result);
});

const getOne = asyncHandler(async (req, res) => {
  const patient = await patientService.getPatientById(req.params.id);
  res.json({ data: patient });
});

const create = asyncHandler(async (req, res) => {
  const patient = await patientService.createPatient(req.body);
  res.status(201).json({ message: 'Patient created', data: patient });
});

const update = asyncHandler(async (req, res) => {
  const patient = await patientService.updatePatient(req.params.id, req.body);
  res.json({ message: 'Patient updated', data: patient });
});

const remove = asyncHandler(async (req, res) => {
  await patientService.deletePatient(req.params.id);
  res.json({ message: 'Patient deleted' });
});

const addNote = asyncHandler(async (req, res) => {
  const patient = await patientService.addNote(req.params.id, req.body.body);
  res.status(201).json({ message: 'Note added', data: patient });
});

const filterOptions = asyncHandler(async (_req, res) => {
  const options = await patientService.getFilterOptions();
  res.json({ data: options });
});

module.exports = { list, getOne, create, update, remove, addNote, filterOptions };
