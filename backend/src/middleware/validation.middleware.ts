import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';
import { sendError } from '../utils/response';

export const validateRequest = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const message = (error as any).errors.map((e: any) => e.message).join(', ');
        return sendError(res, 400, `Validation Error: ${message}`);
      }
      return sendError(res, 400, 'Invalid request data');
    }
  };
};
