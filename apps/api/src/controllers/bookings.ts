import { Request, Response } from 'express';
import { adminDb } from '../lib/firebase';
import { z } from 'zod';
import logger from '../lib/logger';

const BookingSchema = z.object({
  pickup_address: z.string().min(5),
  delivery_address: z.string().min(5),
  service_type: z.enum(['STANDARD', 'EXPRESS', 'SAME_DAY']),
  weight: z.number().positive(),
  dimensions: z.string().optional(),
  estimated_price: z.number().nonnegative(),
  notes: z.string().optional(),
  customer_name: z.string().min(2),
  email: z.string().email(),
});

const UpdateStatusSchema = z.object({
  status: z.string().min(1),
  location: z.string().min(1),
  description: z.string().optional(),
});

// Public: Create Booking
export const createBooking = async (req: Request, res: Response) => {
  try {
    const validatedData = BookingSchema.parse(req.body);
    const tracking_number = `DD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const bookingRef = adminDb.collection('bookings').doc();
    const bookingData = {
      ...validatedData,
      id: bookingRef.id,
      tracking_number,
      status: 'BOOKED',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await bookingRef.set(bookingData);

    // Create initial tracking event in subcollection
    await bookingRef.collection('tracking_events').add({
      status: 'BOOKED',
      location: 'System',
      description: 'Booking received and tracking number generated',
      occurred_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    });

    res.status(201).json({ success: true, data: bookingData });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: error.errors });
    }
    logger.error('Create/Update Booking Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create booking' });
  }
};

// Admin: Get all bookings
export const getBookings = async (req: Request, res: Response) => {
  try {
    const snapshot = await adminDb.collection('bookings').orderBy('created_at', 'desc').get();
    const bookings = await Promise.all(snapshot.docs.map(async doc => {
      const data = doc.data();
      const eventsSnapshot = await doc.ref.collection('tracking_events').orderBy('occurred_at', 'desc').get();
      const tracking_events = eventsSnapshot.docs.map(e => ({ id: e.id, ...e.data() }));
      return { ...data, tracking_events };
    }));

    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Get Bookings Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
};

// Admin: Update Status
export const updateBookingStatus = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const validatedData = UpdateStatusSchema.parse(req.body);
    const { status, location, description } = validatedData;

    const bookingRef = adminDb.collection('bookings').doc(id);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    await bookingRef.update({
      status,
      updated_at: new Date().toISOString()
    });

    await bookingRef.collection('tracking_events').add({
      status,
      location,
      description: description || `Status updated to ${status}`,
      occurred_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    });

    const updatedDoc = await bookingRef.get();
    res.json({ success: true, data: updatedDoc.data() });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: error.errors });
    }
    console.error('Update Booking Status Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update booking' });
  }
};
