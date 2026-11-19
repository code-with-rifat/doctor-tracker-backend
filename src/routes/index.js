const express = require('express');
const { protect } = require('../middleware/auth');
const authRoutes = require('./authRoutes');
const doctorRoutes = require('./doctorRoutes');
const patientRoutes = require('./patientRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const appointmentRoutes = require('./appointmentRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/doctors', protect, doctorRoutes);
router.use('/patients', protect, patientRoutes);
router.use('/dashboard', protect, dashboardRoutes);
router.use('/appointments', protect, appointmentRoutes);

module.exports = router;
