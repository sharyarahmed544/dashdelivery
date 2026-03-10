import { Request, Response } from 'express';
import { adminDb } from '../lib/firebase';

export const adminLogin = async (req: Request, res: Response) => {
  // This endpoint is now legacy as frontend uses Firebase SDK directly.
  // Adding for backward compatibility / explicit role check if needed.
  res.status(410).json({ success: false, message: 'Endpoint moved to client-side Firebase Auth' });
};

export const refreshToken = async (req: Request, res: Response) => {
  res.status(410).json({ success: false, message: 'Firebase handles session refreshing automatically' });
};

export const adminLogout = (req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully' });
};
