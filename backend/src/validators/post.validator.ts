import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200),
    titleAm: z.string().optional().or(z.literal('')),
    titleOm: z.string().optional().or(z.literal('')),
    content: z.string().min(1, 'Content is required'),
    contentAm: z.string().optional().or(z.literal('')),
    contentOm: z.string().optional().or(z.literal('')),
    imageUrl: z.string().nullable().optional().or(z.literal('')),
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  }),
});

export const updatePostSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    titleAm: z.string().optional().or(z.literal('')),
    titleOm: z.string().optional().or(z.literal('')),
    content: z.string().min(1).optional(),
    contentAm: z.string().optional().or(z.literal('')),
    contentOm: z.string().optional().or(z.literal('')),
    imageUrl: z.string().nullable().optional().or(z.literal('')),
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  }),
});


