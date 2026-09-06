import { z } from 'zod';

export const createServiceSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    nameAm: z.string().optional().or(z.literal('')),
    nameOm: z.string().optional().or(z.literal('')),
    description: z.string().optional().or(z.literal('')),
    descriptionAm: z.string().optional().or(z.literal('')),
    descriptionOm: z.string().optional().or(z.literal('')),
    durationMinutes: z.number().int().positive(),
    price: z.number().positive(),
    category: z.string().optional().or(z.literal('')),
    categoryAm: z.string().optional().or(z.literal('')),
    categoryOm: z.string().optional().or(z.literal('')),
    imageUrl: z.string().optional().or(z.literal('')),
  }),
});

export const updateServiceSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    nameAm: z.string().optional().or(z.literal('')),
    nameOm: z.string().optional().or(z.literal('')),
    description: z.string().optional().or(z.literal('')),
    descriptionAm: z.string().optional().or(z.literal('')),
    descriptionOm: z.string().optional().or(z.literal('')),
    durationMinutes: z.number().int().positive().optional(),
    price: z.number().positive().optional(),
    category: z.string().optional().or(z.literal('')),
    categoryAm: z.string().optional().or(z.literal('')),
    categoryOm: z.string().optional().or(z.literal('')),
    isActive: z.boolean().optional(),
    imageUrl: z.string().optional().or(z.literal('')),
  }),
});

