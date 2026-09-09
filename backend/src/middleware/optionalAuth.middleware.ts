/**
 * Optional Authentication Middleware
 * Attempts to extract and verify a JWT token if present,
 * but does NOT reject requests without a token.
 * Useful for routes that work for both guests and logged-in users.
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

/**
 * Extracts user info from the token if provided.
 * Unlike authMiddleware, this always calls next() regardless of token validity.
 */
export const extractOptionalUser = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const payload = verifyToken(token);
      req.user = payload;
    } catch (error) {
      // Token is invalid or expired — silently continue as guest
    }
  }

  next();
};
