import { Router } from 'express';
import * as siteController from '../controllers/site.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';

const router = Router();

// Public route to fetch landing page settings
router.get('/settings', siteController.getSiteSettings);

// Admin-only route to update landing page settings
router.patch('/settings', authMiddleware, authorizeRoles('ADMIN'), siteController.updateSiteSettings);

export default router;
