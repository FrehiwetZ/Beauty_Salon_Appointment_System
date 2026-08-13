import { z } from 'zod';

export const createServiceSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    durationMinutes: z.number().int().positive(),
    price: z.number().positive(),
    imageUrl: z.string().url().optional().or(z.literal('')),
  }),
});

export const updateServiceSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    durationMinutes: z.number().int().positive().optional(),
    price: z.number().positive().optional(),
    isActive: z.boolean().optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
  }),
});
