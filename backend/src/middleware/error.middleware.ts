import { Request, Response, NextFunction } from 'express';

/**
 * errorMiddleware
 *
 * Global error handler for Express.
 * Must be registered as the last middleware in the app.
 * Returns stack trace only in development mode.
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
    // Include stack trace in development for easier debugging
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
