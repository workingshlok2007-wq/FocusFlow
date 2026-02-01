import { Express } from 'express';
import { config } from '../config';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import postRoutes from './post.routes';

export const setupRoutes = (app: Express) => {
  const apiPrefix = `/api/${config.apiVersion}`;

  app.use(`${apiPrefix}/auth`, authRoutes);
  app.use(`${apiPrefix}/users`, userRoutes);
  app.use(`${apiPrefix}/posts`, postRoutes);
};
