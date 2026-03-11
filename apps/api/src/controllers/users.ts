import { Request, Response } from 'express';
import { adminDb } from '../lib/firebase';
import logger from '../lib/logger';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const snapshot = await adminDb.collection('users').get();
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, data: users });
    } catch (error) {
        logger.error('Get Users Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
};
