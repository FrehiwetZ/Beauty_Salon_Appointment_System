import { Router } from 'express';
import * as serviceController from '../controllers/service.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { createServiceSchema, updateServiceSchema } from '../validators/service.validator';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';

const router = Router();

// Public routes
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

// Admin only routes
router.use(authMiddleware);
router.use(authorizeRoles('ADMIN'));

router.post('/', validateRequest(createServiceSchema), serviceController.createService);
router.patch('/:id', validateRequest(updateServiceSchema), serviceController.updateService);

export default router;
