/**
 * =============================================================
 * String Utility Helpers - Beauty Salon Backend
 * =============================================================
 * Common string manipulation functions used across the
 * application for formatting, sanitization, and display.
 * =============================================================
 */

/**
 * Capitalizes the first letter of a string.
 * @param str - The input string
 * @returns The string with the first letter capitalized
 *
 * @example
 * capitalize('hello') // 'Hello'
 * capitalize('HELLO') // 'HELLO'
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Converts a full name from parts to a display-friendly format.
 * @param firstName - First name (optional)
 * @param lastName - Last name (optional)
 * @returns Formatted full name or 'Unknown' if both are empty
 *
 * @example
 * formatFullName('Jane', 'Smith') // 'Jane Smith'
 * formatFullName('Jane', undefined) // 'Jane'
 * formatFullName(undefined, undefined) // 'Unknown'
 */
export const formatFullName = (firstName?: string | null, lastName?: string | null): string => {
  const parts = [firstName, lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : 'Unknown';
};

/**
 * Truncates a string to a maximum length and appends ellipsis.
 * @param str - The input string
 * @param maxLength - Maximum length before truncation (default: 100)
 * @returns Truncated string with '...' or original if shorter
 *
 * @example
 * truncate('Hello world', 5) // 'Hello...'
 * truncate('Hi', 5) // 'Hi'
 */
export const truncate = (str: string, maxLength: number = 100): string => {
  if (!str || str.length <= maxLength) return str || '';
  return str.slice(0, maxLength) + '...';
};

/**
 * Generates a URL-friendly slug from a string.
 * @param str - The input string
 * @returns Lowercase, hyphenated slug
 *
 * @example
 * slugify('Haircut & Styling') // 'haircut-styling'
 * slugify('Deep Cleansing Facial') // 'deep-cleansing-facial'
 */
export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
