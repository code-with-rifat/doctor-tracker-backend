const { z } = require('zod');

const doctorBodySchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(100),
  specialization: z.string().trim().min(2, 'Specialization is required').max(100),
  hospital: z.string().trim().min(2, 'Hospital is required').max(150),
  phone: z
    .string()
    .trim()
    .min(7, 'Phone is required')
    .max(20)
    .regex(/^[+\d][\d\s\-()]+$/, 'Enter a valid phone number'),
  email: z.string().trim().email('Enter a valid email').max(120),
});

const doctorQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  specialization: z.string().optional(),
  hospital: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

module.exports = { doctorBodySchema, doctorQuerySchema };
