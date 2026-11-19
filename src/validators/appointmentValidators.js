const { z } = require('zod');

const appointmentBodySchema = z.object({
  patient: z.string().min(1, 'Patient is required'),
  doctor: z.string().min(1, 'Doctor is required'),
  scheduledAt: z.string().min(1, 'Date and time are required'),
  reason: z.string().trim().min(2, 'Reason is required').max(200),
  status: z.enum(['Scheduled', 'Completed', 'Cancelled']).optional(),
});

module.exports = { appointmentBodySchema };
