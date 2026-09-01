import { Request, Response, NextFunction } from 'express';
import * as staffService from '../services/staff.service';
import { sendSuccess, sendError } from '../utils/response';
import { PaginationQuery, SearchQuery } from '../types';
import { prisma } from '../config/database';

export const getAllStaff = async (req: Request<{}, {}, {}, PaginationQuery & SearchQuery>, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const search = req.query.search as string | undefined;

    const result = await staffService.getAllStaff(page, limit, search);
    return sendSuccess(res, 200, 'Staff retrieved successfully', result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const getStaffById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const staff = await staffService.getStaffById(req.params.id as string);
    return sendSuccess(res, 200, 'Staff member retrieved successfully', staff);
  } catch (error: any) {
    if (error.message === 'Staff not found') return sendError(res, 404, error.message);
    next(error);
  }
};

export const createStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const staff = await staffService.createStaff(req.body);
    return sendSuccess(res, 201, 'Staff member created successfully', staff);
  } catch (error: any) {
    if (error.message === 'Email or username already in use') return sendError(res, 409, error.message);
    next(error);
  }
};

export const updateStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const staff = await staffService.updateStaff(req.params.id as string, req.user!.id, req.user!.role, req.body);
    return sendSuccess(res, 200, 'Staff member updated successfully', staff);
  } catch (error: any) {
    if (error.message === 'Staff not found') return sendError(res, 404, error.message);
    if (error.message === 'Unauthorized') return sendError(res, 403, error.message);
    next(error);
  }
};

export const assignServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { serviceIds } = req.body;
    const staff = await staffService.assignServices(req.params.id as string, serviceIds);
    return sendSuccess(res, 200, 'Services assigned successfully', staff);
  } catch (error: any) {
    if (error.message === 'Staff not found') return sendError(res, 404, error.message);
    next(error);
  }
};

export const removeService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const serviceId = req.params.serviceId as string;
    await staffService.removeService(req.params.id as string, serviceId);
    return sendSuccess(res, 200, 'Service removed successfully');
  } catch (error: any) {
    if (error.message === 'Staff not found') return sendError(res, 404, error.message);
    next(error);
  }
};

export const createBlockedPeriod = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Staff can create blocked periods for themselves, Admins for anyone
    if (req.user!.role !== 'ADMIN' && req.user!.id !== (req.params.id as string)) {
      return sendError(res, 403, 'Unauthorized');
    }
    const blockedPeriod = await staffService.createBlockedPeriod(req.params.id as string, req.body);
    return sendSuccess(res, 201, 'Blocked period created successfully', blockedPeriod);
  } catch (error: any) {
    if (error.message === 'Staff not found') return sendError(res, 404, error.message);
    next(error);
  }
};

export const getBlockedPeriods = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user!.role !== 'ADMIN' && req.user!.id !== (req.params.id as string)) {
      return sendError(res, 403, 'Unauthorized');
    }
    const list = await staffService.getBlockedPeriods(req.params.id as string);
    return sendSuccess(res, 200, 'Blocked periods retrieved successfully', list);
  } catch (error: any) {
    if (error.message === 'Staff not found') return sendError(res, 404, error.message);
    next(error);
  }
};

export const deleteBlockedPeriod = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // First, find who owns this blocked period
    const bp = await prisma.blockedPeriod.findUnique({
      where: { id: req.params.blockedPeriodId as string },
      include: { staff: true },
    });
    if (!bp) return sendError(res, 404, 'Blocked period not found');

    if (req.user!.role !== 'ADMIN' && req.user!.id !== bp.staff.userId) {
      return sendError(res, 403, 'Unauthorized');
    }

    await staffService.deleteBlockedPeriod(req.params.blockedPeriodId as string);
    return sendSuccess(res, 200, 'Blocked period deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const updateWorkingHours = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user!.role !== 'ADMIN' && req.user!.id !== (req.params.id as string)) {
      return sendError(res, 403, 'Unauthorized');
    }
    const hours = await staffService.updateWorkingHours(req.params.id as string, req.body.workingHours);
    return sendSuccess(res, 200, 'Working hours updated successfully', hours);
  } catch (error: any) {
    if (error.message === 'Staff not found') return sendError(res, 404, error.message);
    next(error);
  }
};

export const getWorkingHours = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hours = await staffService.getWorkingHours(req.params.id as string);
    return sendSuccess(res, 200, 'Working hours retrieved successfully', hours);
  } catch (error: any) {
    if (error.message === 'Staff not found') return sendError(res, 404, error.message);
    next(error);
  }
};
