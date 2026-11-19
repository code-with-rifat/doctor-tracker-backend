const express = require('express');
const doctorController = require('../controllers/doctorController');
const validate = require('../middleware/validate');
const { doctorBodySchema } = require('../validators/doctorValidators');
const { patientBodySchema } = require('../validators/patientValidators');

const router = express.Router();

router.get('/meta/filters', doctorController.filterOptions);
router.get('/', doctorController.list);
router.post('/', validate(doctorBodySchema), doctorController.create);
router.get('/:id', doctorController.getOne);
router.put('/:id', validate(doctorBodySchema), doctorController.update);
router.delete('/:id', doctorController.remove);
router.get('/:id/patients', doctorController.listPatients);
router.post(
  '/:id/patients',
  validate(patientBodySchema.omit({ doctor: true })),
  doctorController.addPatient
);

module.exports = router;
