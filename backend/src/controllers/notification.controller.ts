import { Request, Response, NextFunction } from 'express';
import * as notificationService from '../services/notification.service';
import { sendSuccess, sendError } from '../utils/response';

export const getMyNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string || '1');
    const limit = parseInt(req.query.limit as string || '10');

    const result = await notificationService.getUserNotifications(userId, page, limit);
    return sendSuccess(res, 200, 'Notifications retrieved successfully', result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const notification = await notificationService.markAsRead((req.params.id as string), userId);
    return sendSuccess(res, 200, 'Notification marked as read', notification);
  } catch (error: any) {
    if (error.message === 'Notification not found') return sendError(res, 404, error.message);
    if (error.message === 'Unauthorized') return sendError(res, 403, error.message);
    next(error);
  }
};

export const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    await notificationService.markAllAsRead(userId);
    return sendSuccess(res, 200, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};
