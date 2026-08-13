import { z } from 'zod';

export const updateUserSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    password: z.string().min(6).optional(),
  }),
});
