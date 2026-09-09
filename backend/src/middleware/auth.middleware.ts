/**
 * Authentication Middleware
 * Verifies JWT tokens from the Authorization header and
 * attaches the decoded user payload to the request object.
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { sendError } from '../utils/response';

/**
<<<<<<< HEAD
 * authMiddleware
 *
 * Protects routes by verifying the Bearer token in the Authorization header.
 * Attaches the decoded token payload to `req.user` on success.
=======
 * Middleware that requires a valid Bearer token.
 * Rejects requests without a token or with an invalid/expired token.
>>>>>>> 0f26774 (update backend configuration and middleware)
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists and has Bearer format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 401, 'Unauthorized: No token provided');
  }

<<<<<<< HEAD
  // Extract token from "Bearer <token>" format
=======
  // Extract the token from "Bearer <token>"
>>>>>>> 0f26774 (update backend configuration and middleware)
  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return sendError(res, 401, 'Unauthorized: Invalid token');
  }
};
