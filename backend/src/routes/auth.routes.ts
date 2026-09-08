/**
 * Auth Routes
 *
 * Public endpoints for user registration and login.
 * The /me endpoint requires a valid JWT (authMiddleware).
 */
import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public routes — no authentication required
router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);

// Protected route — requires a valid JWT
router.get('/me', authMiddleware, authController.getMe);

export default router;
