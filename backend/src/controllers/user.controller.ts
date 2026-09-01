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

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string || '1');
    const limit = parseInt(req.query.limit as string || '10');
    const search = req.query.search as string | undefined;

    const result = await userService.getAllUsers(page, limit, search);
    return sendSuccess(res, 200, 'Users retrieved successfully', result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isActive } = req.body;
    const user = await userService.updateUserStatus((req.params.id as string), isActive);
    return sendSuccess(res, 200, 'User status updated successfully', user);
  } catch (error: any) {
    if (error.message === 'User not found') return sendError(res, 404, error.message);
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.deleteUser((req.params.id as string));
    return sendSuccess(res, 200, 'User deleted successfully');
  } catch (error: any) {
    if (error.message === 'User not found') return sendError(res, 404, error.message);
    next(error);
  }
};
