import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { updateUserSchema } from '../validators/user.validator';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.patch('/profile', validateRequest(updateUserSchema), userController.updateProfile);

// Admin-only routes
router.get('/', authorizeRoles('ADMIN'), userController.getAllUsers);
router.patch('/:id/status', authorizeRoles('ADMIN'), userController.updateUserStatus);
router.delete('/:id', authorizeRoles('ADMIN'), userController.deleteUser);

export default router;
