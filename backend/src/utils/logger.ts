/**
 * =============================================================
 * Logger Utility - Beauty Salon Backend
 * =============================================================
 * A simple, structured logger wrapper for consistent log
 * formatting across the application. Can be extended to
 * integrate with external logging services.
 * =============================================================
 */

/**
 * Log levels for the application logger.
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Formats a log message with timestamp and level.
 * @param level - The log level
 * @param message - The log message
 * @param meta - Optional metadata object
 * @returns Formatted log string
 */
const formatLog = (level: LogLevel, message: string, meta?: Record<string, unknown>): string => {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` | ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level}] ${message}${metaStr}`;
};

/**
 * Application logger with structured output.
 *
 * @example
 * logger.info('Server started', { port: 5000 });
 * logger.error('Database connection failed', { error: err.message });
 * logger.warn('Rate limit approaching', { ip: '192.168.1.1' });
 */
export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(formatLog(LogLevel.DEBUG, message, meta));
    }
  },

  info: (message: string, meta?: Record<string, unknown>) => {
    console.log(formatLog(LogLevel.INFO, message, meta));
  },

  warn: (message: string, meta?: Record<string, unknown>) => {
    console.warn(formatLog(LogLevel.WARN, message, meta));
  },

  error: (message: string, meta?: Record<string, unknown>) => {
    console.error(formatLog(LogLevel.ERROR, message, meta));
  },
};

export default logger;
