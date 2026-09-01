import { Request, Response, NextFunction } from 'express';
import * as ratingService from '../services/rating.service';
import { sendSuccess, sendError } from '../utils/response';

export const createRating = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const rating = await ratingService.createRating(userId, req.body);
    return sendSuccess(res, 201, 'Rating submitted successfully', rating);
  } catch (error: any) {
    if (error.message === 'Appointment not found') return sendError(res, 404, error.message);
    if (error.message === 'Unauthorized') return sendError(res, 403, error.message);
    if (error.message === 'Can only rate completed appointments') return sendError(res, 400, error.message);
    if (error.message === 'You have already rated this appointment') return sendError(res, 409, error.message);
    next(error);
  }
};

export const getStaffRatings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ratings = await ratingService.getRatingsByStaff((req.params.staffId as string));
    return sendSuccess(res, 200, 'Staff ratings retrieved successfully', ratings);
  } catch (error) {
    next(error);
  }
};

export const getServiceRatings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ratings = await ratingService.getRatingsByService((req.params.serviceId as string));
    return sendSuccess(res, 200, 'Service ratings retrieved successfully', ratings);
  } catch (error) {
    next(error);
  }
};

export const getAllRatings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ratings = await ratingService.getAllRatings();
    return sendSuccess(res, 200, 'All ratings retrieved successfully', ratings);
  } catch (error) {
    next(error);
  }
};

export const deleteRating = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ratingService.deleteRating(req.params.id as string);
    return sendSuccess(res, 200, 'Rating deleted successfully');
  } catch (error: any) {
    if (error.message === 'Rating not found') return sendError(res, 404, error.message);
    next(error);
  }
};
