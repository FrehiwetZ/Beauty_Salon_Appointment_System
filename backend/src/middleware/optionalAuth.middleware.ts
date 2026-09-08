import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

/**
 * extractOptionalUser
 *
 * Middleware that attempts to decode the Bearer token if present.
 * Does NOT reject the request if the token is missing or invalid —
 * it simply skips user attachment and calls next().
 * Useful for routes accessible to both guests and authenticated users.
 */
export const extractOptionalUser = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const payload = verifyToken(token);
      req.user = payload;
    } catch (error) {
      // Ignore error for optional auth
    }
  }

  next();
};
