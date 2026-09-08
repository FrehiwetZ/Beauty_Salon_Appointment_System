/**
 * =============================================================
 * Validation Constants - Beauty Salon Appointment System
 * =============================================================
 * Centralized validation constants used across validator schemas.
 * These constants ensure consistency between frontend and backend
 * validation rules.
 * =============================================================
 */

/**
 * Minimum and maximum lengths for common string fields.
 */
export const VALIDATION_LIMITS = {
  /** Username must be between 3 and 30 characters */
  USERNAME_MIN: 3,
  USERNAME_MAX: 30,

  /** Password must be at least 6 characters */
  PASSWORD_MIN: 6,

  /** Customer name must be at least 2 characters */
  CUSTOMER_NAME_MIN: 2,

  /** Customer phone must be at least 5 characters */
  CUSTOMER_PHONE_MIN: 5,

  /** Post title max length */
  POST_TITLE_MAX: 200,

  /** Service name minimum length */
  SERVICE_NAME_MIN: 2,

  /** Rating score range */
  RATING_MIN: 1,
  RATING_MAX: 5,

  /** Working hours day of week range (0 = Sunday, 6 = Saturday) */
  DAY_OF_WEEK_MIN: 0,
  DAY_OF_WEEK_MAX: 6,
} as const;

/**
 * Regex patterns used for input validation.
 */
export const VALIDATION_PATTERNS = {
  /** Date format: YYYY-MM-DD */
  DATE: /^\d{4}-\d{2}-\d{2}$/,

  /** Time format: HH:mm (24-hour) */
  TIME: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
} as const;

/**
 * Allowed values for enum-like fields.
 */
export const VALIDATION_ENUMS = {
  /** Appointment status values */
  APPOINTMENT_STATUS: [
    'PENDING',
    'CONFIRMED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'NO_SHOW',
    'REJECTED',
  ] as const,

  /** Post status values */
  POST_STATUS: ['PENDING', 'APPROVED', 'REJECTED'] as const,

  /** User role values */
  USER_ROLE: ['USER', 'STAFF', 'ADMIN'] as const,

  /** Rating satisfaction levels */
  SATISFACTION: ['Satisfied', 'Medium', 'Not Satisfied'] as const,
} as const;
