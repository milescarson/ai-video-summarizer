import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import summaryRouter from './routes/summary.route';
import { logger } from './utils';
import { ZodError } from 'zod';

export function createApp(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.path}`);
    next();
  });

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api', summaryRouter);

  app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error('Error handler caught:', error);

    if (error instanceof ZodError) {
      res.status(400).json({
        error: 'Validation Error',
        details: error.errors.map((err) => ({
          path: err.path.join('.') as string,
          message: err.message,
        })),
      });
      return;
    }

    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({
      error: error.message || 'Internal Server Error',
    });
  });

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
  });

  return app;
}
