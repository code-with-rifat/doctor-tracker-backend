const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const validate = require('../middleware/validate');
const { appointmentBodySchema } = require('../validators/appointmentValidators');

const router = express.Router();

router.get('/', appointmentController.list);
router.post('/', validate(appointmentBodySchema), appointmentController.create);
router.put('/:id', validate(appointmentBodySchema), appointmentController.update);
router.delete('/:id', appointmentController.remove);

module.exports = router;
