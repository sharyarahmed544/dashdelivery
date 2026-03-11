import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { adminDb } from './lib/firebase';
import logger from './lib/logger';

dotenv.config();

const app = express();
const port = process.env.PORT || 4500;

// Request ID Tracking
app.use((req: Request, res: Response, next: NextFunction) => {
  req.id = (req.headers['x-request-id'] as string) || uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Request Logging
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info('Incoming Request', {
    requestId: req.id,
    method: req.method,
    path: req.path,
    ip: req.ip
  });
  next();
});

// Advanced Security Middleware (CSP)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://identitytoolkit.googleapis.com', 'https://securetoken.googleapis.com'],
    },
  },
}));

// CORS Configuration with Preflight Caching
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  maxAge: 86400, // 24 hours
};
app.use(cors(corsOptions));

// Request Body Size Limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Specialized Rate Limiters
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Stricter for auth
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts, please try again after an hour' }
});

const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

import publicRoutes from './routes/public';
import authRoutes from './routes/adminAuth';
import adminRoutes from './routes/admin';

// API Routes
app.use('/api/v1/admin/auth', authLimiter, authRoutes);
app.use('/api/v1', defaultLimiter, publicRoutes);
app.use('/api/v1/admin', defaultLimiter, adminRoutes);

// Public Health Check
app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'Dash Delivery API is operational', version: '1.0.0' });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('[Global Error]:', {
    requestId: req.id,
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
