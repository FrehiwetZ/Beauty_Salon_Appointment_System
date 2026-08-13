import { Request, Response, NextFunction } from 'express';
import * as staffService from '../services/staff.service';
import { sendSuccess, sendError } from '../utils/response';
import { PaginationQuery, SearchQuery } from '../types';

export const getAllStaff = async (req: Request<{}, {}, {}, PaginationQuery & SearchQuery>, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const search = req.query.search;

    const result = await staffService.getAllStaff(page, limit, search);
    return sendSuccess(res, 200, 'Staff retrieved successfully', result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const getStaffById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const staff = await staffService.getStaffById((req.params.id as string));
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
    const staff = await staffService.updateStaff((req.params.id as string), req.user!.id, req.user!.role, req.body);
    return sendSuccess(res, 200, 'Staff member updated successfully', staff);
  } catch (error: any) {
    if (error.message === 'Staff not found') return sendError(res, 404, error.message);
    if (error.message === 'Unauthorized') return sendError(res, 403, error.message);
    next(error);
  }
};
