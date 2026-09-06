import { Request, Response, NextFunction } from 'express';
import * as staffService from '../services/staff.service';
import { sendSuccess, sendError } from '../utils/response';
import { PaginationQuery, SearchQuery } from '../types';
import { prisma } from '../config/database';

// ==========================================
// GET ALL STAFF
// ==========================================
export const getAllStaff = async (
  req: Request<{}, {}, {}, PaginationQuery & SearchQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const search = req.query.search as string | undefined;

    const result = await staffService.getAllStaff(
      page,
      limit,
      search
    );

    return sendSuccess(
      res,
      200,
      'Staff retrieved successfully',
      result.data,
      result.pagination
    );
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET STAFF BY ID
// ==========================================
export const getStaffById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const staff = await staffService.getStaffById(
      req.params.id as string
    );

    return sendSuccess(
      res,
      200,
      'Staff member retrieved successfully',
      staff
    );
  } catch (error: any) {
    if (error?.message === 'Staff not found') {
      return sendError(
        res,
        404,
        error.message
      );
    }

    next(error);
  }
};

// ==========================================
// CREATE STAFF
// ==========================================
export const createStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('================================');
    console.log('CREATE STAFF REQUEST');
    console.log('BODY:', req.body);
    console.log('================================');

    const staff = await staffService.createStaff(
      req.body
    );

    console.log('STAFF CREATED:', staff.id);

    return sendSuccess(
      res,
      201,
      'Staff member created successfully',
      staff
    );
  } catch (error: any) {
    console.error('================================');
    console.error('CREATE STAFF ERROR');
    console.error(error);
    console.error('MESSAGE:', error?.message);
    console.error('STACK:', error?.stack);
    console.error('================================');

    // Duplicate email
    if (
      error?.message === 'Email already in use'
    ) {
      return sendError(
        res,
        409,
        error.message
      );
    }

    // Duplicate username
    if (
      error?.message === 'Username already in use'
    ) {
      return sendError(
        res,
        409,
        error.message
      );
    }

    // Required fields
    if (
      error?.message === 'Email is required' ||
      error?.message === 'Username is required' ||
      error?.message === 'Password is required' ||
      error?.message === 'First name is required' ||
      error?.message === 'Last name is required'
    ) {
      return sendError(
        res,
        400,
        error.message
      );
    }

    // Password validation
    if (
      error?.message ===
      'Password must be at least 6 characters'
    ) {
      return sendError(
        res,
        400,
        error.message
      );
    }

    // Invalid services
    if (
      typeof error?.message === 'string' &&
      error.message.startsWith(
        'Invalid service ID'
      )
    ) {
      return sendError(
        res,
        400,
        error.message
      );
    }

    // Everything else goes to global error handler
    next(error);
  }
};

// ==========================================
// UPDATE STAFF
// ==========================================
export const updateStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const staff = await staffService.updateStaff(
      req.params.id as string,
      req.user!.id,
      req.user!.role,
      req.body
    );

    return sendSuccess(
      res,
      200,
      'Staff member updated successfully',
      staff
    );
  } catch (error: any) {
    if (
      error?.message === 'Staff not found'
    ) {
      return sendError(
        res,
        404,
        error.message
      );
    }

    if (
      error?.message === 'Unauthorized'
    ) {
      return sendError(
        res,
        403,
        error.message
      );
    }

    next(error);
  }
};

// ==========================================
// ASSIGN SERVICES
// ==========================================
export const assignServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { serviceIds } = req.body;

    const staff =
      await staffService.assignServices(
        req.params.id as string,
        serviceIds
      );

    return sendSuccess(
      res,
      200,
      'Services assigned successfully',
      staff
    );
  } catch (error: any) {
    if (
      error?.message === 'Staff not found'
    ) {
      return sendError(
        res,
        404,
        error.message
      );
    }

    next(error);
  }
};

// ==========================================
// REMOVE SERVICE
// ==========================================
export const removeService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const serviceId =
      req.params.serviceId as string;

    await staffService.removeService(
      req.params.id as string,
      serviceId
    );

    return sendSuccess(
      res,
      200,
      'Service removed successfully'
    );
  } catch (error: any) {
    if (
      error?.message === 'Staff not found'
    ) {
      return sendError(
        res,
        404,
        error.message
      );
    }

    next(error);
  }
};

// ==========================================
// CREATE BLOCKED PERIOD
// ==========================================
export const createBlockedPeriod = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Staff can create blocked periods
    // for themselves, admins for anyone.
    if (
      req.user!.role !== 'ADMIN' &&
      req.user!.id !==
      (req.params.id as string)
    ) {
      return sendError(
        res,
        403,
        'Unauthorized'
      );
    }

    const blockedPeriod =
      await staffService.createBlockedPeriod(
        req.params.id as string,
        req.body
      );

    return sendSuccess(
      res,
      201,
      'Blocked period created successfully',
      blockedPeriod
    );
  } catch (error: any) {
    if (
      error?.message === 'Staff not found'
    ) {
      return sendError(
        res,
        404,
        error.message
      );
    }

    next(error);
  }
};

// ==========================================
// GET BLOCKED PERIODS
// ==========================================
export const getBlockedPeriods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (
      req.user!.role !== 'ADMIN' &&
      req.user!.id !==
      (req.params.id as string)
    ) {
      return sendError(
        res,
        403,
        'Unauthorized'
      );
    }

    const list =
      await staffService.getBlockedPeriods(
        req.params.id as string
      );

    return sendSuccess(
      res,
      200,
      'Blocked periods retrieved successfully',
      list
    );
  } catch (error: any) {
    if (
      error?.message === 'Staff not found'
    ) {
      return sendError(
        res,
        404,
        error.message
      );
    }

    next(error);
  }
};

// ==========================================
// DELETE BLOCKED PERIOD
// ==========================================
export const deleteBlockedPeriod = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bp =
      await prisma.blockedPeriod.findUnique({
        where: {
          id: req.params
            .blockedPeriodId as string,
        },
        include: {
          staff: true,
        },
      });

    if (!bp) {
      return sendError(
        res,
        404,
        'Blocked period not found'
      );
    }

    if (
      req.user!.role !== 'ADMIN' &&
      req.user!.id !== bp.staff.userId
    ) {
      return sendError(
        res,
        403,
        'Unauthorized'
      );
    }

    await staffService.deleteBlockedPeriod(
      req.params
        .blockedPeriodId as string
    );

    return sendSuccess(
      res,
      200,
      'Blocked period deleted successfully'
    );
  } catch (error) {
    next(error);
  }
};

// ==========================================
// UPDATE WORKING HOURS
// ==========================================
export const updateWorkingHours = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (
      req.user!.role !== 'ADMIN' &&
      req.user!.id !==
      (req.params.id as string)
    ) {
      return sendError(
        res,
        403,
        'Unauthorized'
      );
    }

    const hours =
      await staffService.updateWorkingHours(
        req.params.id as string,
        req.body.workingHours
      );

    return sendSuccess(
      res,
      200,
      'Working hours updated successfully',
      hours
    );
  } catch (error: any) {
    if (
      error?.message === 'Staff not found'
    ) {
      return sendError(
        res,
        404,
        error.message
      );
    }

    next(error);
  }
};

// ==========================================
// GET WORKING HOURS
// ==========================================
export const getWorkingHours = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hours =
      await staffService.getWorkingHours(
        req.params.id as string
      );

    return sendSuccess(
      res,
      200,
      'Working hours retrieved successfully',
      hours
    );
  } catch (error: any) {
    if (
      error?.message === 'Staff not found'
    ) {
      return sendError(
        res,
        404,
        error.message
      );
    }

    next(error);
  }
};

// ==========================================
// SOFT DELETE STAFF
// ==========================================
export const softDeleteStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await staffService.softDeleteStaff(
      req.params.id as string
    );
    return sendSuccess(res, 200, 'Staff member deleted successfully', result);
  } catch (error: any) {
    if (error?.message === 'Staff not found') {
      return sendError(res, 404, error.message);
    }
    next(error);
  }
};

// ==========================================
// DEACTIVATE STAFF
// ==========================================
export const deactivateStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reason, deactivatedUntil } = req.body;
    if (!reason || !String(reason).trim()) {
      return sendError(res, 400, 'Deactivation reason is required');
    }
    const result = await staffService.deactivateStaff(
      req.params.id as string,
      String(reason).trim(),
      deactivatedUntil || undefined
    );
    return sendSuccess(res, 200, 'Staff member deactivated', result);
  } catch (error: any) {
    if (error?.message === 'Staff not found') {
      return sendError(res, 404, error.message);
    }
    if (error?.message === 'Staff member has been deleted') {
      return sendError(res, 400, error.message);
    }
    next(error);
  }
};

// ==========================================
// REACTIVATE STAFF
// ==========================================
export const reactivateStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await staffService.reactivateStaff(
      req.params.id as string
    );
    return sendSuccess(res, 200, 'Staff member reactivated', result);
  } catch (error: any) {
    if (error?.message === 'Staff not found') {
      return sendError(res, 404, error.message);
    }
    if (error?.message === 'Cannot reactivate a deleted staff member') {
      return sendError(res, 400, error.message);
    }
    next(error);
  }
};

// ==========================================
// GET STAFF APPOINTMENTS (admin)
// ==========================================
export const getStaffAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointments = await staffService.getStaffAppointments(
      req.params.id as string
    );
    return sendSuccess(res, 200, 'Staff appointments retrieved', appointments);
  } catch (error: any) {
    if (error?.message === 'Staff not found') {
      return sendError(res, 404, error.message);
    }
    next(error);
  }
};

// ==========================================
// GET ACTIVE STAFF FOR ADMIN (appointment view)
// ==========================================
export const getActiveStaffForAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const staff = await staffService.getActiveStaffForAdmin();
    return sendSuccess(res, 200, 'Active staff retrieved', staff);
  } catch (error) {
    next(error);
  }
};