import { Router } from 'express';
import * as staffController from '../controllers/staff.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { createStaffSchema, updateStaffSchema } from '../validators/staff.validator';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';

const router = Router();

// Publicly accessible to explore staff
router.get('/', staffController.getAllStaff);
router.get('/:id', staffController.getStaffById);

// Admin only routes
router.use(authMiddleware);

router.post('/', authorizeRoles('ADMIN'), validateRequest(createStaffSchema), staffController.createStaff);
router.patch('/:id', authorizeRoles('ADMIN', 'STAFF'), validateRequest(updateStaffSchema), staffController.updateStaff);

export default router;
