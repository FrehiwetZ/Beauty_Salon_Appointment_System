/**
 * Global Error Handling Middleware
 * Catches all unhandled errors and returns a standardized
 * JSON error response. Includes stack traces in development mode.
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Express error handler — must have 4 parameters to be recognized as error middleware.
 * @param err - The error object thrown or passed via next(err)
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
