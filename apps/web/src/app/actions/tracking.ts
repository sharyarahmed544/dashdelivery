'use server';

import { adminDb } from "@/lib/firebase/admin";

export interface TrackingEvent {
  status: string;
  location: string;
  timestamp: string;
  icon: string;
  type: 'done' | 'active' | 'pending';
}

export interface TrackingInfo {
  id: string;
  progress: number;
  events: TrackingEvent[];
}

export async function getTrackingInfo(trackingId: string): Promise<TrackingInfo | null> {
  // Mock Data Fallback for Demo/Disabled API
  const mockData: Record<string, TrackingInfo> = {
    'DD-88742': {
      id: 'DD-88742',
      progress: 68,
      events: [
        { status: 'Delivered', location: 'Berlin, DE', timestamp: 'Today, 16:30', icon: '✅', type: 'done' },
        { status: 'Out for Delivery', location: 'Berlin Hub', timestamp: 'Today, 09:12', icon: '🚚', type: 'active' },
        { status: 'In Transit', location: 'Frankfurt, DE', timestamp: 'Yesterday, 22:45', icon: '✈️', type: 'done' },
        { status: 'Picked Up', location: 'London, UK', timestamp: 'Mar 08, 14:20', icon: '📦', type: 'done' },
      ]
    },
    'DD-88750': {
      id: 'DD-88750',
      progress: 25,
      events: [
        { status: 'In Transit', location: 'Manchester Hub', timestamp: 'Today, 14:00', icon: '🚚', type: 'active' },
        { status: 'Picked Up', location: 'Manchester, UK', timestamp: 'Today, 10:30', icon: '📦', type: 'done' },
        { status: 'Order Processed', location: 'Manchester, UK', timestamp: 'Today, 09:15', icon: '📑', type: 'done' },
      ]
    }
  };

  try {
    if (mockData[trackingId]) return mockData[trackingId];
    if (!adminDb) return null;

    const docRef = adminDb.collection("tracking_events").doc(trackingId);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      return docSnap.data() as TrackingInfo;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching tracking info:", error);
    return mockData[trackingId] || null;
  }
}
