import { Request, Response } from 'express';
import { adminDb } from '../lib/firebase';

export const trackParcel = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const snapshot = await adminDb.collection('bookings')
      .where('tracking_number', '==', id)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ success: false, message: 'Tracking ID not found' });
    }

    const bookingDoc = snapshot.docs[0];
    const booking = bookingDoc.data();

    // Fetch tracking events from subcollection
    const eventsSnapshot = await bookingDoc.ref.collection('tracking_events')
      .orderBy('occurred_at', 'desc')
      .get();
    
    const tracking_events = eventsSnapshot.docs.map(e => ({ id: e.id, ...e.data() }));

    // Map to frontend expected format
    const statuses = [
      'BOOKED', 
      'COLLECTED', 
      'IN_SORTING_HUB', 
      'CUSTOMS_CLEARED', 
      'OUT_FOR_DELIVERY', 
      'DELIVERED'
    ];
    
    const currentIndex = statuses.indexOf(booking.status);
    const progress = Math.round(((currentIndex + 1) / statuses.length) * 100);

    const formattedEvents = tracking_events.map((event: any) => ({
      status: event.status,
      location: event.location,
      description: event.description,
      timestamp: new Date(event.occurred_at).toLocaleString(),
      type: event.status === 'DELIVERED' ? 'success' : 'info',
      icon: event.status === 'DELIVERED' ? '✅' : '📦'
    }));

    res.json({
      success: true,
      data: {
        tracking_number: booking.tracking_number,
        status: booking.status,
        progress,
        events: formattedEvents
      }
    });
  } catch (error) {
    console.error('Track Parcel Error:', error);
    res.status(500).json({ success: false, message: 'Tracking failed' });
  }
};
