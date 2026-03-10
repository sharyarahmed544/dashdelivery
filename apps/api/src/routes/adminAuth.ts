import { Router } from 'express';
import { adminLogin, refreshToken, adminLogout } from '../controllers/adminAuth';

const router = Router();

router.post('/login', adminLogin);
router.post('/refresh', refreshToken);
router.post('/logout', adminLogout);

export default router;
