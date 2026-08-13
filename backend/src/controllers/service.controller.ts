import { Request, Response, NextFunction } from 'express';
import * as serviceService from '../services/service.service';
import { sendSuccess, sendError } from '../utils/response';
import { PaginationQuery, SearchQuery } from '../types';

export const getAllServices = async (req: Request<{}, {}, {}, PaginationQuery & SearchQuery>, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const search = req.query.search;

    const result = await serviceService.getAllServices(page, limit, search);
    return sendSuccess(res, 200, 'Services retrieved successfully', result.data, result.pagination);
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await serviceService.getServiceById((req.params.id as string));
    return sendSuccess(res, 200, 'Service retrieved successfully', service);
  } catch (error: any) {
    if (error.message === 'Service not found') return sendError(res, 404, error.message);
    next(error);
  }
};

export const createService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await serviceService.createService(req.body);
    return sendSuccess(res, 201, 'Service created successfully', service);
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await serviceService.updateService((req.params.id as string), req.body);
    return sendSuccess(res, 200, 'Service updated successfully', service);
  } catch (error: any) {
    if (error.message === 'Service not found') return sendError(res, 404, error.message);
    next(error);
  }
};
