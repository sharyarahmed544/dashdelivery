import { Request, Response } from 'express';
import { adminDb } from '../lib/firebase';

export const calculatePrice = async (req: Request, res: Response) => {
  const { from_country, to_country, service_type, weight } = req.body;

  try {
    const snapshot = await adminDb.collection('priceRules')
      .where('from_country', '==', from_country)
      .where('to_country', '==', to_country)
      .where('service_type', '==', service_type)
      .where('is_active', '==', true)
      .limit(1)
      .get();

    if (snapshot.empty) {
      // Fallback or default logic if no specific rule exists
      const defaultTotal = 15.0 + (weight * 2.5); // Example fallback
      return res.json({
        success: true,
        data: {
          base_price: 15.0,
          weight_charge: weight * 2.5,
          total: defaultTotal,
          currency: 'GBP'
        }
      });
    }

    const rule = snapshot.docs[0].data();
    const weight_charge = weight * (rule.per_kg_price || 0);
    const subtotal = (rule.base_price || 0) + weight_charge;
    const fuel_surcharge = subtotal * ((rule.fuel_levy_pct || 0) / 100);
    const total = subtotal + fuel_surcharge;

    res.json({
      success: true,
      data: {
        base_price: rule.base_price,
        per_kg_price: rule.per_kg_price,
        weight_charge,
        fuel_surcharge,
        total,
        currency: 'GBP'
      }
    });
  } catch (error: any) {
    console.error('Calculate Price Error:', {
      message: error.message,
      stack: error.stack,
      request: { from_country, to_country, service_type, weight }
    });
    res.status(500).json({ success: false, message: 'Price calculation failed' });
  }
};
