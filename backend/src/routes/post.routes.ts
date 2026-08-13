import { Router } from 'express';
import * as postController from '../controllers/post.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { createPostSchema, updatePostSchema } from '../validators/post.validator';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';
import { extractOptionalUser } from '../middleware/optionalAuth.middleware'; // I will create this

const router = Router();

// We need an optional auth middleware to check if user is logged in to show unpublished posts to staff/admin
router.get('/', extractOptionalUser, postController.getAllPosts);
router.get('/:id', extractOptionalUser, postController.getPostById);

// Protected routes (Admin & Staff)
router.use(authMiddleware);
router.use(authorizeRoles('ADMIN', 'STAFF'));

router.post('/', validateRequest(createPostSchema), postController.createPost);
router.patch('/:id', validateRequest(updatePostSchema), postController.updatePost);
router.delete('/:id', postController.deletePost);

export default router;
