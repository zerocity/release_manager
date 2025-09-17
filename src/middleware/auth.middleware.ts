import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key is required',
    });
  }

  if (apiKey !== env.API_KEY) {
    return res.status(403).json({
      success: false,
      error: 'Invalid API key',
    });
  }

  next();
};
