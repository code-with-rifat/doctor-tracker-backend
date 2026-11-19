const asyncHandler = require('../utils/asyncHandler');
const doctorService = require('../services/doctorService');
const patientService = require('../services/patientService');

const list = asyncHandler(async (req, res) => {
  const result = await doctorService.listDoctors(req.query);
  res.json(result);
});

const getOne = asyncHandler(async (req, res) => {
  const doctor = await doctorService.getDoctorById(req.params.id);
  res.json({ data: doctor });
});

const create = asyncHandler(async (req, res) => {
  const doctor = await doctorService.createDoctor(req.body);
  res.status(201).json({ message: 'Doctor created', data: doctor });
});

const update = asyncHandler(async (req, res) => {
  const doctor = await doctorService.updateDoctor(req.params.id, req.body);
  res.json({ message: 'Doctor updated', data: doctor });
});

const remove = asyncHandler(async (req, res) => {
  await doctorService.deleteDoctor(req.params.id);
  res.json({ message: 'Doctor deleted' });
});

const filterOptions = asyncHandler(async (_req, res) => {
  const options = await doctorService.getFilterOptions();
  res.json({ data: options });
});

const listPatients = asyncHandler(async (req, res) => {
  const result = await patientService.listPatientsByDoctor(req.params.id, req.query);
  res.json(result);
});

const addPatient = asyncHandler(async (req, res) => {
  const patient = await patientService.createPatient({
    ...req.body,
    doctor: req.params.id,
  });
  res.status(201).json({ message: 'Patient added', data: patient });
});

module.exports = {
  list,
  getOne,
  create,
  update,
  remove,
  filterOptions,
  listPatients,
  addPatient,
};
