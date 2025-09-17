import express from 'express';
import helmet from 'helmet';

import { errorHandler, loggerMiddleware, notFoundHandler } from './middleware';
import { healthRoutes, deploymentRoutes } from './routes';

const app = express();

// Middleware
app.use(helmet());
//
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(loggerMiddleware);

// Routes
app.use('/health', healthRoutes);
app.use('/api', deploymentRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

export { app };
