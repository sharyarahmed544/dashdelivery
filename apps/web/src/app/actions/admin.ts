'use server';

import { adminDb } from "@/lib/firebase/admin";
import { PricingRules } from "@/lib/pricing";

export interface Booking {
  id: string;
  clientName: string;
  route: string;
  status: 'In Transit' | 'Delivered' | 'Processing' | 'Pending';
  amount: number;
  timestamp: any;
}

export interface Quote {
  id: string;
  clientEmail: string;
  details: string;
  status: 'Pending' | 'Responded';
  timestamp: any;
}

export async function getAdminBookings(): Promise<Booking[]> {
  try {
    if (!adminDb) return [];
    const snapshot = await adminDb.collection("bookings").orderBy("timestamp", "desc").limit(10).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

export async function getAdminQuotes(): Promise<Quote[]> {
  try {
    if (!adminDb) return [];
    const snapshot = await adminDb.collection("quotes").orderBy("timestamp", "desc").limit(10).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quote));
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return [];
  }
}

export async function updatePricingRules(rules: PricingRules) {
  try {
    if (!adminDb) return { success: false };
    await adminDb.collection("price_rules").doc("current").set(rules);
    return { success: true };
  } catch (error) {
    console.error("Error updating pricing rules:", error);
    return { success: false };
  }
}
