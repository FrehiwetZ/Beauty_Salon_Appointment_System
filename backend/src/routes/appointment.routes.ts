/**
 * Appointment Routes
 *
 * All routes require authentication (authMiddleware applied globally).
 * Role-specific access is enforced per-route via authorizeRoles.
 */
import { Router } from 'express';
import * as appointmentController from '../controllers/appointment.controller';
import { validateRequest } from '../middleware/validation.middleware';
import {
  createAppointmentSchema,
  updateAppointmentStatusSchema,
  getAvailabilitySchema,
  rescheduleAppointmentSchema,
} from '../validators/appointment.validator';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';

const router = Router();

// All appointment routes require the user to be authenticated
router.use(authMiddleware);

// ── User & Staff routes ──────────────────────────────────────────────────────
router.get('/availability', validateRequest(getAvailabilitySchema), appointmentController.getAvailability);
router.post('/', authorizeRoles('USER', 'ADMIN'), validateRequest(createAppointmentSchema), appointmentController.createAppointment);
router.get('/my-appointments', appointmentController.getMyAppointments);
router.patch('/:id/status', validateRequest(updateAppointmentStatusSchema), appointmentController.updateAppointmentStatus);
router.patch('/:id/reschedule', authorizeRoles('USER', 'ADMIN'), validateRequest(rescheduleAppointmentSchema), appointmentController.rescheduleAppointment);

// ── Admin-only routes ────────────────────────────────────────────────────────
router.get('/', authorizeRoles('ADMIN'), appointmentController.getAllAppointments);

export default router;
