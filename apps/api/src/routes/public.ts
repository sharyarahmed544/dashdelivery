import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getServices, getTestimonials, getDepots } from '../controllers/public';
import { trackParcel } from '../controllers/tracking';
import { calculatePrice } from '../controllers/pricing';
import { getPublicContent, getPublicStats } from '../controllers/home';
import { verifyInvoice } from '../controllers/invoices';

const router = Router();

// Stricter rate limit for public invoice verification — 100 per IP per hour
const verifyLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip || 'unknown',
    message: { success: false, message: 'Too many verification requests, please try again later' },
});

router.get('/services', getServices);
router.get('/testimonials', getTestimonials);
router.get('/depots', getDepots);
router.get('/track/:id', trackParcel);
router.post('/calculate-price', calculatePrice);
router.get('/content', getPublicContent);
router.get('/stats', getPublicStats);
router.get('/verify/:invoiceNumber', verifyLimiter, verifyInvoice);

export default router;
