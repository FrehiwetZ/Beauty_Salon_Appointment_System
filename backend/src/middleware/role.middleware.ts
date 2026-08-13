import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(res, 403, 'Forbidden: Insufficient permissions');
    }
    next();
  };
};
