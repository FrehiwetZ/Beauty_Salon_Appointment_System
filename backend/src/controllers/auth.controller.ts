import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.registerUser(req.body);
    return sendSuccess(res, 201, 'User registered successfully', result);
  } catch (error: any) {
    if (error.message === 'Email or username already in use') {
      return sendError(res, 409, error.message);
    }
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.loginUser(req.body);
    return sendSuccess(res, 200, 'Login successful', result);
  } catch (error: any) {
    if (error.message === 'Invalid credentials') {
      return sendError(res, 401, error.message);
    }
    if (error.message === 'Your account has been disabled') {
      return sendError(res, 403, error.message);
    }
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }
    const user = await authService.getMe(req.user.id);
    return sendSuccess(res, 200, 'User details retrieved successfully', user);
  } catch (error: any) {
    if (error.message === 'User not found') {
      return sendError(res, 404, error.message);
    }
    next(error);
  }
};
