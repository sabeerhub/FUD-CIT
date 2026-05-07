import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export const registrationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    fullName: z.string().min(2),
    role: z.enum(['STUDENT', 'LECTURER', 'ADMIN']),
    regNumber: z.string().optional(),
    level: z.string().optional(),
    year: z.string().optional(),
    staffId: z.string().optional(),
    designation: z.string().optional(),
  }),
});
