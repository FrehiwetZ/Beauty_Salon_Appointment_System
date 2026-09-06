import { z } from 'zod';

export const createStaffSchema = z.object({
  body: z.object({
    email: z.string().email(),
    username: z.string().min(3).max(30),
    password: z.string().min(6),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    bio: z.string().optional().or(z.literal('')),
    bioAm: z.string().optional().or(z.literal('')),
    bioOm: z.string().optional().or(z.literal('')),
    position: z.string().optional().or(z.literal('')),
    positionAm: z.string().optional().or(z.literal('')),
    positionOm: z.string().optional().or(z.literal('')),
    imageUrl: z.string().optional().or(z.literal('')),
    serviceIds: z.array(z.string().min(1)).min(1, 'At least one service is required for a staff member'),
  }),
});

export const updateStaffSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    bio: z.string().optional().or(z.literal('')),
    bioAm: z.string().optional().or(z.literal('')),
    bioOm: z.string().optional().or(z.literal('')),
    position: z.string().optional().or(z.literal('')),
    positionAm: z.string().optional().or(z.literal('')),
    positionOm: z.string().optional().or(z.literal('')),
    imageUrl: z.string().optional().or(z.literal('')),
    isActive: z.boolean().optional(),
  }),
});


export const assignServicesSchema = z.object({
  body: z.object({
    serviceIds: z.array(z.string().min(1)),
  }),
});

export const createBlockedPeriodSchema = z.object({
  body: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be HH:mm format').optional().or(z.literal('')),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be HH:mm format').optional().or(z.literal('')),
    reason: z.string().optional(),
  }),
});

export const updateWorkingHoursSchema = z.object({
  body: z.object({
    workingHours: z.array(
      z.object({
        dayOfWeek: z.number().min(0).max(6),
        startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be HH:mm format'),
        endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be HH:mm format'),
        isDayOff: z.boolean().optional(),
      })
    ),
  }),
});
