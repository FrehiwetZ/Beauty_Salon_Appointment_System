import { Response } from 'express';

/**
 * Sends a standardized success JSON response.
 */
export const sendSuccess = (
  res: Response,
  statusCode: number,
  message: string,
  data: any = {},
  pagination?: any
) => {
  const response: any = {
    success: true,
    message,
    data,
  };

  if (pagination) {
    response.pagination = pagination;
  }

  return res.status(statusCode).json(response);
};

/**
 * Sends a standardized error JSON response.
 */
export const sendError = (
  res: Response,
  statusCode: number,
  message: string
) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};