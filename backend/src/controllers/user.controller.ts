import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { sendSuccess, sendError } from '../utils/response';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const user = await userService.getUserById(userId);
    if (!user) {
      return sendError(res, 404, 'User not found');
    }
    return sendSuccess(res, 200, 'Profile retrieved successfully', user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const user = await userService.updateUser(userId, req.body);
    return sendSuccess(res, 200, 'Profile updated successfully', user);
  } catch (error) {
    next(error);
  }
};
