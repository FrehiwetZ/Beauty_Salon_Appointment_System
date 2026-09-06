import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';
import { sendError } from '../utils/response';

export const validateRequest = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      if (parsed && typeof parsed === 'object' && 'body' in parsed && parsed.body !== undefined) {
        req.body = parsed.body;
      }
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const message = error.issues.map((e: any) => `${e.path.join('.') || 'field'}: ${e.message}`).join(', ');
        return sendError(res, 400, `Validation Error: ${message}`);
      }
      return sendError(res, 400, 'Invalid request data');
    }
  };
};
