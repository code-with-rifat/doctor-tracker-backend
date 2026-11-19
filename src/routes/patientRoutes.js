const express = require('express');
const patientController = require('../controllers/patientController');
const validate = require('../middleware/validate');
const { patientBodySchema } = require('../validators/patientValidators');

const router = express.Router();

router.get('/meta/filters', patientController.filterOptions);
router.get('/', patientController.list);
router.post('/', validate(patientBodySchema), patientController.create);
router.get('/:id', patientController.getOne);
router.put('/:id', validate(patientBodySchema), patientController.update);
router.delete('/:id', patientController.remove);

module.exports = router;
