/**
 * Calculates the end time given a start time (HH:mm) and duration in minutes.
 * Returns the end time in HH:mm format.
 */
export const calculateEndTime = (startTime: string, durationMinutes: number): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);

  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

  const endHours = String(endDate.getHours()).padStart(2, '0');
  const endMinutes = String(endDate.getMinutes()).padStart(2, '0');

  return `${endHours}:${endMinutes}`;
};

/**
 * Checks if two time periods overlap.
 * Format is HH:mm
 */
export const isTimeOverlapping = (start1: string, end1: string, start2: string, end2: string): boolean => {
  const s1 = parseInt(start1.replace(':', ''), 10);
  const e1 = parseInt(end1.replace(':', ''), 10);
  const s2 = parseInt(start2.replace(':', ''), 10);
  const e2 = parseInt(end2.replace(':', ''), 10);

  return Math.max(s1, s2) < Math.min(e1, e2);
};

/**
 * Returns the day of the week (0-6) for a given date string (YYYY-MM-DD).
 */
export const getDayOfWeek = (dateString: string): number => {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getDay();
};