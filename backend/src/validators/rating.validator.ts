import { z } from 'zod';

export const createRatingSchema = z.object({
  body: z.object({
    appointmentId: z.string().uuid(),
    score: z.number().int().min(1).max(5),
    comment: z.string().optional(),
  }),
});
