/**
 * =============================================================
 * Validator Index - Beauty Salon Appointment System
 * =============================================================
 * Central barrel export for all Zod validation schemas.
 * Import validators from this file for cleaner imports:
 *
 *   import { registerSchema, loginSchema } from '../validators';
 *
 * =============================================================
 */

// Authentication validators
export { registerSchema, loginSchema } from './auth.validator';

// Appointment validators
export {
  createAppointmentSchema,
  getAvailabilitySchema,
  updateAppointmentStatusSchema,
  rescheduleAppointmentSchema,
} from './appointment.validator';

// Service validators
export { createServiceSchema, updateServiceSchema } from './service.validator';

// Staff validators
export {
  createStaffSchema,
  updateStaffSchema,
  assignServicesSchema,
  createBlockedPeriodSchema,
  updateWorkingHoursSchema,
} from './staff.validator';

// Post validators
export { createPostSchema, updatePostSchema } from './post.validator';

// Rating validators
export { createRatingSchema } from './rating.validator';

// User validators
export { updateUserSchema } from './user.validator';
