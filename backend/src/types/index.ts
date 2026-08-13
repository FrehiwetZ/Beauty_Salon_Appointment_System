import { JwtPayload } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface SearchQuery {
  search?: string;
}
