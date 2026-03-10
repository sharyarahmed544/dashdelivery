import { Request, Response } from 'express';
import { adminDb } from '../lib/firebase';

// Public: Create Booking
export const createBooking = async (req: Request, res: Response) => {
  const { pickup_address, delivery_address, service_type, weight, dimensions, estimated_price, notes } = req.body;

  try {
    const tracking_number = `DD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const bookingRef = adminDb.collection('bookings').doc();
    const bookingData = {
      id: bookingRef.id,
      tracking_number,
      pickup_address,
      delivery_address,
      service_type,
      weight,
      dimensions,
      estimated_price,
      notes,
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
  } catch (error) {
    console.error('Create Booking Error:', error);
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
  const { status, location, description } = req.body;

  try {
    const bookingRef = adminDb.collection('bookings').doc(id);
    await bookingRef.update({
      status,
      updated_at: new Date().toISOString()
    });

    await bookingRef.collection('tracking_events').add({
      status,
      location,
      description,
      occurred_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    });

    const updatedDoc = await bookingRef.get();
    res.json({ success: true, data: updatedDoc.data() });
  } catch (error) {
    console.error('Update Booking Status Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update booking' });
  }
};
