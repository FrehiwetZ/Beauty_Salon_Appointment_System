import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { updateUserSchema } from '../validators/user.validator';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.patch('/profile', validateRequest(updateUserSchema), userController.updateProfile);

export default router;
