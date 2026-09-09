/**
 * Express Application Configuration
 * Sets up middleware, routes, and error handling for the API.
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { errorMiddleware } from './middleware/error.middleware';

// ─── Environment Variables ───────────────────────────────────
dotenv.config();

// ─── Express App Initialization ──────────────────────────────
const app: Express = express();

// ─── Global Middleware ───────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── Health Check ────────────────────────────────────────────
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

// ─── Route Imports ───────────────────────────────────────────
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import staffRoutes from './routes/staff.routes';
import serviceRoutes from './routes/service.routes';
import appointmentRoutes from './routes/appointment.routes';
import ratingRoutes from './routes/rating.routes';
import postRoutes from './routes/post.routes';
import notificationRoutes from './routes/notification.routes';
import dashboardRoutes from './routes/dashboard.routes';
import uploadRoutes from './routes/upload.routes';
import siteRoutes from './routes/site.routes';

// ─── API Routes (v1) ────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/staff', staffRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/ratings', ratingRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/site', siteRoutes);

// ─── Global Error Handler ────────────────────────────────────
app.use(errorMiddleware);

export default app;
