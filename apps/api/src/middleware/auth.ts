import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase';
import logger from '../lib/logger';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
    email?: string;
  };
}

export const authenticateJWT = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      req.user = {
        userId: decodedToken.uid,
        role: (decodedToken.role as string) || 'CUSTOMER',
        email: decodedToken.email
      };
      next();
    } catch (error) {
      logger.error('Firebase Auth Error:', error);
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
  } else {
    res.status(401).json({ success: false, message: 'Authorization header missing' });
  }
};

export const authorizeRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }
    next();
  };
};
