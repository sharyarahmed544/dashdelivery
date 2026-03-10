import { Router } from 'express';
import { getContentBlocks, updateContentBlock, getSiteSettings, updateSiteSetting } from '../controllers/cms';
import { getPriceRules, upsertPriceRule } from '../controllers/settings';
import { getBookings, updateBookingStatus, createBooking } from '../controllers/bookings';
import { getQuotes, updateQuote } from '../controllers/quotes';
import { getDashboardStats } from '../controllers/dashboard';
import { authenticateJWT, authorizeRole } from '../middleware/auth';

const router = Router();

// Apply Auth to all Admin routes
router.use(authenticateJWT);
router.use(authorizeRole(['ADMIN', 'SUPER_ADMIN']));

// Dashboard
router.get('/dashboard', getDashboardStats);

// CMS
router.get('/content', getContentBlocks);
router.put('/content/:id', updateContentBlock);
router.get('/settings', getSiteSettings);
router.put('/settings/:key', updateSiteSetting);

// Pricing
router.get('/pricing', getPriceRules);
router.post('/pricing', upsertPriceRule);

// Bookings
router.get('/bookings', getBookings);
router.put('/bookings/:id/status', updateBookingStatus);

// Quotes
router.get('/quotes', getQuotes);
router.put('/quotes/:id', updateQuote);

export default router;
