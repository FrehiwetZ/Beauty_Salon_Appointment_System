/**
 * Request Validation Middleware
 * Uses Zod schemas to validate incoming request data (body, query, params).
 * Returns a 400 error with detailed messages on validation failure.
 */

import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';
import { sendError } from '../utils/response';

/**
 * Creates middleware that validates a request against a Zod schema.
 * @param schema - The Zod schema to validate against
 * @returns Express middleware that parses and validates the request
 *
 * @example
 * router.post('/register', validateRequest(registerSchema), authController.register);
 */
export const validateRequest = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse body, query, and params against the schema
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Replace req.body with the parsed (and sanitized) data
      if (parsed && typeof parsed === 'object' && 'body' in parsed && parsed.body !== undefined) {
        req.body = parsed.body;
      }
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        // Format Zod validation errors into a readable message
        const message = error.issues.map((e: any) => `${e.path.join('.') || 'field'}: ${e.message}`).join(', ');
        return sendError(res, 400, `Validation Error: ${message}`);
      }
      return sendError(res, 400, 'Invalid request data');
    }
  };
};
