import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { adminDb } from './lib/firebase';
import logger from './lib/logger';

dotenv.config();

const app = express();
const port = process.env.PORT || 4500;

// Security Middleware
app.use(helmet());

// CORS Configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api/', limiter);

import publicRoutes from './routes/public';
import authRoutes from './routes/adminAuth';
import adminRoutes from './routes/admin';

// API Routes
app.use('/api/v1', publicRoutes);
app.use('/api/v1/admin/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);

// Public Health Check
app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'Dash Delivery API is operational', version: '1.0.0' });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('[Global Error]:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    path: req.path
  });

  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});

app.listen(port, () => {
  console.log(`[server]: Dash Delivery API is running at http://localhost:${port}`);
});

export { app };
