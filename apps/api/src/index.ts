import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { adminDb } from './lib/firebase';

dotenv.config();

const app = express();
const port = process.env.PORT || 4500;

import publicRoutes from './routes/public';
import authRoutes from './routes/adminAuth';
import adminRoutes from './routes/admin';

app.use(helmet());
app.use(cors());
app.use(express.json());

// Public Routes
app.use('/api/v1', publicRoutes);

// Auth Routes
app.use('/api/v1/admin/auth', authRoutes);

// Admin Protected Routes
app.use('/api/v1/admin', adminRoutes);

// Public Health Check
app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'Dash Delivery API is operational', version: '1.0.0' });
});

// Stats Endpoint (Section 9.1)
app.get('/api/v1/stats', async (req, res) => {
  // Mocking stats for now until data is seeded
  res.json({
    success: true,
    data: {
      parcels_delivered: 125430,
      countries_covered: 28,
      active_drivers: 2800,
      customer_satisfaction: 99.8
    }
  });
});

app.listen(port, () => {
  console.log(`[server]: Dash Delivery API is running at http://localhost:${port}`);
});

export { app };
