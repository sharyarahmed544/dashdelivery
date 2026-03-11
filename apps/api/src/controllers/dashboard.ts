import { Request, Response } from 'express';
import { adminDb } from '../lib/firebase';
import logger from '../lib/logger';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      todayBookingsSnap,
      pendingQuotesSnap,
      newContactsSnap,
      revenueSnap
    ] = await Promise.all([
      adminDb.collection('bookings').where('created_at', '>=', today).count().get(),
      adminDb.collection('quotes').where('status', '==', 'NEW').count().get(),
      adminDb.collection('contacts').where('status', '==', 'NEW').count().get(),
      adminDb.collection('bookings')
        .where('created_at', '>=', firstOfMonth)
        .get()
    ]);

    const totalRevenue = revenueSnap.docs
      .filter(doc => doc.data().status !== 'CANCELLED')
      .reduce((sum, doc) => sum + (doc.data().estimated_price || 0), 0);

    // Status breakdown using the same revenue snapshot or a separate query if needed
    // Realistically we need ALL bookings for a true breakdown, or a cloud function to maintain aggregates
    // For now, we'll fetch all or use the monthly ones as a sample, but let's do a full fetch for breakdown if not too many
    const allBookingsSnap = await adminDb.collection('bookings').get();
    const statusCounts: Record<string, number> = {};
    allBookingsSnap.docs.forEach(doc => {
      const status = doc.data().status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    const statusBreakdown = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      _count: { id: count }
    }));

    res.json({
      success: true,
      data: {
        stats: {
          today_bookings: todayBookingsSnap.data().count,
          monthly_revenue: totalRevenue,
          pending_quotes: pendingQuotesSnap.data().count,
          new_contacts: newContactsSnap.data().count
        },
        status_breakdown: statusBreakdown
      }
    });
  } catch (error: unknown) {
    logger.error('Dashboard Stats Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
};
