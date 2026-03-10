import { Request, Response } from 'express';
import { adminDb } from '../lib/firebase';
import logger from '../lib/logger';

export const getServices = async (req: Request, res: Response) => {
  try {
    const snapshot = await adminDb.collection('services')
      .where('is_active', '==', true)
      .orderBy('sort_order', 'asc')
      .get();

    const services = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: services });
  } catch (error) {
    console.error('Get Services Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch services' });
  }
};

export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const snapshot = await adminDb.collection('testimonials')
      .where('is_published', '==', true)
      .orderBy('sort_order', 'asc')
      .get();

    const testimonials = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Get Testimonials Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch testimonials' });
  }
};

export const getDepots = async (req: Request, res: Response) => {
  try {
    const snapshot = await adminDb.collection('depotLocations')
      .where('is_active', '==', true)
      .get();

    const depots = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: depots });
  } catch (error) {
    logger.error('API Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch depot locations' });
  }
};
