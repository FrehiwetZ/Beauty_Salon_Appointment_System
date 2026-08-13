import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

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
