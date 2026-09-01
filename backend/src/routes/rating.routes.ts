import { Router } from 'express';
import * as ratingController from '../controllers/rating.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { createRatingSchema } from '../validators/rating.validator';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';

const router = Router();

// Publicly view ratings
router.get('/staff/:staffId', ratingController.getStaffRatings);
router.get('/service/:serviceId', ratingController.getServiceRatings);

// Protected route to create ratings
router.post('/', authMiddleware, authorizeRoles('USER'), validateRequest(createRatingSchema), ratingController.createRating);

// Admin routes for review moderation
router.get('/', authMiddleware, authorizeRoles('ADMIN'), ratingController.getAllRatings);
router.delete('/:id', authMiddleware, authorizeRoles('ADMIN'), ratingController.deleteRating);

export default router;
