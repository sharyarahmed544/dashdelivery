import { Request, Response } from 'express';
import { adminDb } from '../lib/firebase';
import { z } from 'zod';
import logger from '../lib/logger';

const PriceRuleSchema = z.object({
  id: z.string().optional(),
  from_country: z.string().min(2),
  to_country: z.string().min(2),
  service_type: z.string().min(1),
  base_price: z.union([z.number(), z.string()]).transform(v => Number(v)),
  per_kg_price: z.union([z.number(), z.string()]).transform(v => Number(v)),
  fuel_levy_pct: z.union([z.number(), z.string()]).transform(v => Number(v)),
  is_active: z.boolean(),
});

export const getPriceRules = async (req: Request, res: Response) => {
  try {
    const snapshot = await adminDb.collection('priceRules').orderBy('created_at', 'desc').get();
    const rules = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: rules });
  } catch (error) {
    console.error('Get Price Rules Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch price rules' });
  }
};

export const upsertPriceRule = async (req: Request, res: Response) => {
  try {
    const validatedData = PriceRuleSchema.parse(req.body);
    const { id, from_country, to_country, service_type, base_price, per_kg_price, fuel_levy_pct, is_active } = validatedData;
    const ruleRef = id ? adminDb.collection('priceRules').doc(id) : adminDb.collection('priceRules').doc();
    const ruleData = {
      from_country,
      to_country,
      service_type,
      base_price: Number(base_price),
      per_kg_price: Number(per_kg_price),
      fuel_levy_pct: Number(fuel_levy_pct),
      is_active,
      updated_at: new Date().toISOString(),
      created_at: id ? undefined : new Date().toISOString()
    };

    // Remove undefined for created_at if updating
    if (!id) {
      await ruleRef.set(ruleData);
    } else {
      await ruleRef.update(ruleData);
    }

    const saved = await ruleRef.get();
    res.json({ success: true, data: { id: saved.id, ...saved.data() } });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: error.errors });
    }
    logger.error('Upsert Price Rule Error:', error);
    res.status(500).json({ success: false, message: 'Failed to save price rule' });
  }
};
