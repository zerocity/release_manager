import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { ZodError } from 'zod';

export const errorHandler = (error: Error, req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    if (env.NODE_ENV !== 'test') {
      console.warn('Validation error:', error);
    }
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.errors,
    });
  }

  console.error('Caught unexpected Error:', error);
  const statusCode = 500;
  const message = 'Internal server error';

  const payload = {
    success: false,
    error: message,
  };

  switch (env.NODE_ENV) {
    case 'production':
      res.status(statusCode).json(payload);
      break;
    case 'test':
      res.status(statusCode).json(payload);
      break;
    case 'development':
      res.status(statusCode).json({
        ...payload,
        stack: error.stack,
        details: error.message,
      });
      break;
    default:
      break;
  }
};
