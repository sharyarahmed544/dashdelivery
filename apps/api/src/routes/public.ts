import { Router } from 'express';
import { getServices, getTestimonials, getDepots } from '../controllers/public';
import { trackParcel } from '../controllers/tracking';
import { calculatePrice } from '../controllers/pricing';
import { getPublicContent, getPublicStats } from '../controllers/home';

const router = Router();

router.get('/services', getServices);
router.get('/testimonials', getTestimonials);
router.get('/depots', getDepots);
router.get('/track/:id', trackParcel);
router.post('/calculate-price', calculatePrice);
router.get('/content', getPublicContent);
router.get('/stats', getPublicStats);

export default router;
