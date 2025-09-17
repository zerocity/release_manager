import { Request, Response } from 'express';
import { env } from '../config/env';

export class HealthController {
  checkHealth(_req: Request, res: Response) {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
    });
  }
}
