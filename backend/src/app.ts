import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorMiddleware } from './middleware/error.middleware';

// Load environment variables
dotenv.config();

const app: Express = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import staffRoutes from './routes/staff.routes';
import serviceRoutes from './routes/service.routes';
import appointmentRoutes from './routes/appointment.routes';
import ratingRoutes from './routes/rating.routes';
import postRoutes from './routes/post.routes';
import notificationRoutes from './routes/notification.routes';
import dashboardRoutes from './routes/dashboard.routes';

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/staff', staffRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/ratings', ratingRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Global Error Handler
app.use(errorMiddleware);

export default app;
