import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100),
    content: z.string().min(10),
    imageUrl: z.string().url().optional().or(z.literal('')),
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  }),
});

export const updatePostSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100).optional(),
    content: z.string().min(10).optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  }),
});
