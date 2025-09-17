import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export function loggerMiddleware(req: Request, _res: Response, next: NextFunction) {
  if (env.NODE_ENV === 'development') {
    console.log(`[${req.method}] ${req.path}`);
  }
  next();
}
