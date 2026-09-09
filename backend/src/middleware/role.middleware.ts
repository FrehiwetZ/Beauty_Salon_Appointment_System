/**
 * Role-Based Authorization Middleware
 * Restricts route access to users with specific roles.
 * Must be used after authMiddleware to ensure req.user exists.
 */

import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

/**
 * Creates middleware that only allows access to specified roles.
 * @param roles - Allowed roles (e.g., 'ADMIN', 'STAFF')
 * @returns Express middleware that checks the user's role
 *
 * @example
 * router.get('/admin-only', authMiddleware, authorizeRoles('ADMIN'), controller);
 */
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(res, 403, 'Forbidden: Insufficient permissions');
    }
    next();
  };
};
