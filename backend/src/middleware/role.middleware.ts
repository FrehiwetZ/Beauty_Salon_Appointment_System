import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

/**
 * authorizeRoles
 *
 * Middleware factory that restricts route access to specific user roles.
 * Must be used after authMiddleware so that req.user is already populated.
 *
 * @param roles - One or more allowed role strings (e.g. 'admin', 'stylist')
 */
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(res, 403, 'Forbidden: Insufficient permissions');
    }
    next();
  };
};
