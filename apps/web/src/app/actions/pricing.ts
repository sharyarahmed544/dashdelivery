'use server';

import { adminDb } from "@/lib/firebase/admin";

export async function getPricingRules() {
  const defaultRules = {
    baseRate: 12,
    weightMultiplier: 1.6,
    fuelLevyPercentage: 0.035,
  };

  try {
    if (!adminDb) {
      return defaultRules;
    }

    const docRef = adminDb.collection("price_rules").doc("current");
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      return {
        baseRate: data?.baseRate ?? defaultRules.baseRate,
        weightMultiplier: data?.weightMultiplier ?? defaultRules.weightMultiplier,
        fuelLevyPercentage: data?.fuelLevyPercentage ?? defaultRules.fuelLevyPercentage,
      };
    }
    
    return defaultRules;
  } catch (error) {
    console.error("Error fetching pricing rules:", error);
    return defaultRules; // Fallback to safe defaults
  }
}
