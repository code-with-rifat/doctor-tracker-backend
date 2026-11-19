const { z } = require('zod');

const patientBodySchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(100),
  age: z.coerce.number().int().min(0).max(130),
  gender: z.enum(['Male', 'Female', 'Other']),
  phone: z
    .string()
    .trim()
    .min(7, 'Phone is required')
    .max(20)
    .regex(/^[+\d][\d\s\-()]+$/, 'Enter a valid phone number'),
  condition: z.string().trim().min(2, 'Condition is required').max(120),
  status: z.enum(['Active', 'Discharged']).optional(),
  doctor: z.string().optional(),
});

const noteBodySchema = z.object({
  body: z.string().trim().min(2, 'Note is too short').max(1000),
});

const patientQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  condition: z.string().optional(),
  doctor: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

module.exports = { patientBodySchema, patientQuerySchema, noteBodySchema };
