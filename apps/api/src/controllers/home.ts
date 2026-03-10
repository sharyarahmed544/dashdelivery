import { Request, Response } from 'express';
import { adminDb } from '../lib/firebase';
import logger from '../lib/logger';

export const getPublicContent = async (req: Request, res: Response) => {
  try {
    const snapshot = await adminDb.collection('contentBlocks').where('is_active', '==', true).get();

    const content: any = {};
    snapshot.forEach(doc => {
      const b = doc.data();
      content[b.key] = {
        title: b.title,
        body: b.body,
        cta_text: b.cta_text,
        cta_url: b.cta_url
      };
    });

    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Get Public Content Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch site content' });
  }
};

export const getPublicStats = async (req: Request, res: Response) => {
  try {
    const bookingsColl = adminDb.collection('bookings');
    const [totalSnap, deliveredSnap] = await Promise.all([
      bookingsColl.count().get(),
      bookingsColl.where('status', '==', 'DELIVERED').count().get()
    ]);

    const bookingCount = totalSnap.data().count;
    const deliveredCount = deliveredSnap.data().count;

    res.json({
      success: true,
      data: {
        parcels_delivered: 4200000 + deliveredCount,
        countries_covered: 28,
        on_time_rate: 99.4,
        businesses: 12000
      }
    });
  } catch (error) {
    logger.error('Home/Dashboard API Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};
