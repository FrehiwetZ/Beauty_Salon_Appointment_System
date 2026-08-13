import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboard.service';
import { sendSuccess, sendError } from '../utils/response';

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const role = req.user!.role;

    let data;

    if (role === 'ADMIN') {
      data = await dashboardService.getAdminDashboardData();
    } else if (role === 'STAFF') {
      data = await dashboardService.getStaffDashboardData(userId);
    } else {
      data = await dashboardService.getUserDashboardData(userId);
    }

    return sendSuccess(res, 200, `${role} dashboard data retrieved successfully`, data);
  } catch (error: any) {
    if (error.message === 'Staff profile not found') return sendError(res, 404, error.message);
    next(error);
  }
};
