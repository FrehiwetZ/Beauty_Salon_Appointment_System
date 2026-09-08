/**
 * Appointment Controller
 *
 * Handles all HTTP request/response logic for appointment operations:
 * - Availability checking
 * - Creating, retrieving, and listing appointments
 * - Updating appointment status (confirm, cancel, complete)
 * - Rescheduling appointments
 */
import { Request, Response, NextFunction } from 'express';
import * as appointmentService from '../services/appointment.service';
import * as availabilityService from '../services/availability.service';
import { sendSuccess, sendError } from '../utils/response';
import { AppointmentStatus } from '@prisma/client';

// ──────────────────────────────────────────────────────────────────────────────
// GET AVAILABILITY
// ──────────────────────────────────────────────────────────────────────────────
export const getAvailability = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { serviceId, date, staffId } = req.query;
    const slots = await availabilityService.getAvailableSlots(
      serviceId as string,
      date as string,
      staffId ? (staffId as string) : undefined
    );
    return sendSuccess(res, 200, 'Availability retrieved successfully', slots);
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// CREATE APPOINTMENT
// ──────────────────────────────────────────────────────────────────────────────
export const createAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const appointment = await appointmentService.createAppointment(userId, req.body);
    return sendSuccess(res, 201, 'Appointment created successfully', appointment);
  } catch (error: any) {
    // These errors come from the booking validation layer and represent
    // scheduling conflicts (e.g., double-booking, outside working hours).
    // They are forwarded to the client as 409 Conflict instead of 500.
    if (
      error.message === 'Staff is already booked at this time' ||
      error.message === 'Appointment time is outside staff working hours' ||
      error.message?.includes('is already booked') ||
      error.message?.includes('not available')
    ) {
      return sendError(res, 409, error.message);
    }
    next(error);
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET MY APPOINTMENTS
// ──────────────────────────────────────────────────────────────────────────────
export const getMyAppointments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const role = req.user!.role;

    let appointments;
    // Staff members are linked via their StaffProfile, not directly by userId,
    // so we must resolve the staffProfile.id before querying appointments.
    if (role === 'STAFF') {
      // Find staff profile ID
      const { prisma } = require('../config/database');
      const profile = await prisma.staffProfile.findUnique({ where: { userId } });
      if (!profile) return sendError(res, 404, 'Staff profile not found');
      appointments = await appointmentService.getAppointmentsByStaff(profile.id);
    } else {
      appointments = await appointmentService.getAppointmentsByUser(userId);
    }

    return sendSuccess(res, 200, 'Appointments retrieved successfully', appointments);
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// GET ALL APPOINTMENTS (Admin)
// ──────────────────────────────────────────────────────────────────────────────
export const getAllAppointments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Parse pagination params (default: page 1, 10 items per page)
    const page = parseInt(req.query.page as string || '1');
    const limit = parseInt(req.query.limit as string || '10');

    // Optional filters passed as query parameters
    const status = req.query.status as AppointmentStatus | undefined;
    const date = req.query.date as string | undefined;
    const staffId = req.query.staffId as string | undefined;
    const serviceId = req.query.serviceId as string | undefined;
    const userId = req.query.userId as string | undefined;

    const result = await appointmentService.getAllAppointments(page, limit, status, date, staffId, serviceId, userId);
    return sendSuccess(res, 200, 'All appointments retrieved successfully', result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// UPDATE APPOINTMENT STATUS
// ──────────────────────────────────────────────────────────────────────────────
export const updateAppointmentStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const appointmentId = req.params.id as string;
    const userId = req.user!.id;
    const role = req.user!.role;
    const { status, cancellationReason } = req.body;

    const appointment = await appointmentService.updateAppointmentStatus(appointmentId, userId, role, status, cancellationReason);
    return sendSuccess(res, 200, 'Appointment status updated successfully', appointment);
  } catch (error: any) {
    if (error.message === 'Appointment not found') return sendError(res, 404, error.message);
    if (error.message === 'Unauthorized') return sendError(res, 403, error.message);
    if (error.message === 'Users can only cancel appointments') return sendError(res, 403, error.message);
    next(error);
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// RESCHEDULE APPOINTMENT
// ──────────────────────────────────────────────────────────────────────────────
export const rescheduleAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const appointmentId = req.params.id as string;
    const userId = req.user!.id;
    const role = req.user!.role;
    const appointment = await appointmentService.rescheduleAppointment(appointmentId, userId, role, req.body);
    return sendSuccess(res, 200, 'Appointment rescheduled successfully', appointment);
  } catch (error: any) {
    if (error.message === 'Appointment not found') return sendError(res, 404, error.message);
    if (error.message === 'Unauthorized') return sendError(res, 403, error.message);
    if (error.message === 'This slot/staff member is not available.') return sendError(res, 409, error.message);
    next(error);
  }
};
