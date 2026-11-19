const express = require('express');
const { protect } = require('../middleware/auth');
const authRoutes = require('./authRoutes');
const doctorRoutes = require('./doctorRoutes');
const patientRoutes = require('./patientRoutes');
const dashboardRoutes = require('./dashboardRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/doctors', protect, doctorRoutes);
router.use('/patients', protect, patientRoutes);
router.use('/dashboard', protect, dashboardRoutes);

module.exports = router;
