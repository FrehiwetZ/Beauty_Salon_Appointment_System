import { Router } from 'express';

import * as staffController from '../controllers/staff.controller';

import { validateRequest } from '../middleware/validation.middleware';

import {
    createStaffSchema,
    updateStaffSchema,
    assignServicesSchema,
    createBlockedPeriodSchema,
    updateWorkingHoursSchema,
} from '../validators/staff.validator';

import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';

const router = Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

router.get(
    '/',
    staffController.getAllStaff
);

router.get(
    '/:id',
    staffController.getStaffById
);

router.get(
    '/:id/working-hours',
    staffController.getWorkingHours
);

// ==========================================
// PROTECTED ROUTES
// ==========================================

router.use(authMiddleware);

// ==========================================
// ADMIN SERVICE MANAGEMENT
// ==========================================

router.post(
    '/:id/services',
    authorizeRoles('ADMIN'),
    validateRequest(assignServicesSchema),
    staffController.assignServices
);

router.delete(
    '/:id/services/:serviceId',
    authorizeRoles('ADMIN'),
    staffController.removeService
);

// ==========================================
// CREATE STAFF
// ==========================================

router.post(
    '/',
    authorizeRoles('ADMIN'),
    validateRequest(createStaffSchema),
    staffController.createStaff
);

// ==========================================
// UPDATE STAFF
// ==========================================

router.patch(
    '/:id',
    authorizeRoles('ADMIN', 'STAFF'),
    validateRequest(updateStaffSchema),
    staffController.updateStaff
);

// ==========================================
// WORKING HOURS
// ==========================================

router.post(
    '/:id/working-hours',
    authorizeRoles('ADMIN', 'STAFF'),
    validateRequest(updateWorkingHoursSchema),
    staffController.updateWorkingHours
);

// ==========================================
// BLOCKED PERIODS
// ==========================================

router.post(
    '/:id/blocked-periods',
    authorizeRoles('ADMIN', 'STAFF'),
    validateRequest(createBlockedPeriodSchema),
    staffController.createBlockedPeriod
);

router.get(
    '/:id/blocked-periods',
    authorizeRoles('ADMIN', 'STAFF'),
    staffController.getBlockedPeriods
);

router.delete(
    '/blocked-periods/:blockedPeriodId',
    authorizeRoles('ADMIN', 'STAFF'),
    staffController.deleteBlockedPeriod
);

// ==========================================
// ADMIN APPOINTMENT VIEW
// ==========================================

router.get(
    '/admin/active',
    authorizeRoles('ADMIN'),
    staffController.getActiveStaffForAdmin
);

router.get(
    '/:id/appointments',
    authorizeRoles('ADMIN'),
    staffController.getStaffAppointments
);

// ==========================================
// ADMIN STAFF STATUS MANAGEMENT
// ==========================================

router.delete(
    '/:id/soft-delete',
    authorizeRoles('ADMIN'),
    staffController.softDeleteStaff
);

router.patch(
    '/:id/deactivate',
    authorizeRoles('ADMIN'),
    staffController.deactivateStaff
);

router.patch(
    '/:id/reactivate',
    authorizeRoles('ADMIN'),
    staffController.reactivateStaff
);

export default router;