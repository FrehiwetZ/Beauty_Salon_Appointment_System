import { z } from 'zod';

export const createAppointmentSchema = z.object({
  body: z.object({
    staffId: z.string().uuid().optional(),
    serviceId: z.string().uuid(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be HH:mm format'),
    notes: z.string().optional(),
    customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
    customerPhone: z.string().min(5, 'Customer phone number must be at least 5 characters'),
  }),
});

export const getAvailabilitySchema = z.object({
  query: z.object({
    serviceId: z.string().uuid(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),
    staffId: z.string().uuid().optional(),
  }),
});

export const updateAppointmentStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'REJECTED']),
    cancellationReason: z.string().optional(),
  }),
});

export const rescheduleAppointmentSchema = z.object({
  body: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be HH:mm format'),
    staffId: z.string().uuid().optional(),
  }),
});
