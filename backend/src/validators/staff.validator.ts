import { z } from 'zod';

export const createStaffSchema = z.object({
  body: z.object({
    email: z.string().email(),
    username: z.string().min(3).max(30),
    password: z.string().min(6),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    bio: z.string().optional(),
    position: z.string().optional(),
  }),
});

export const updateStaffSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    bio: z.string().optional(),
    position: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});
