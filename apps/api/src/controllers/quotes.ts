import { Request, Response } from 'express';
import { adminDb } from '../lib/firebase';
import { z } from 'zod';
import logger from '../lib/logger';

const QuoteSchema = z.object({
  company_name: z.string().optional(),
  contact_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  from_country: z.string().min(2),
  to_country: z.string().min(2),
  service_type: z.string().min(1),
  weight: z.number().positive(),
  cargo_description: z.string().min(5),
  message: z.string().optional(),
});

const UpdateQuoteSchema = z.object({
  status: z.string().min(1),
  price_offered: z.number().nonnegative().optional(),
});

// Public: Submit Quote Request
export const createQuoteRequest = async (req: Request, res: Response) => {
  try {
    const validatedData = QuoteSchema.parse(req.body);
    const quoteRef = adminDb.collection('quotes').doc();
    const quoteData = {
      ...validatedData,
      id: quoteRef.id,
      status: 'NEW',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await quoteRef.set(quoteData);
    res.status(201).json({ success: true, data: quoteData });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: error.errors });
    }
    logger.error('Create/Update Quote Error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit quote request' });
  }
};

// Admin: Get all quotes
export const getQuotes = async (req: Request, res: Response) => {
  try {
    const snapshot = await adminDb.collection('quotes').orderBy('created_at', 'desc').get();
    const quotes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: quotes });
  } catch (error) {
    console.error('Get Quotes Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch quotes' });
  }
};

// Admin: Update Quote (e.g. set price)
export const updateQuote = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const validatedData = UpdateQuoteSchema.parse(req.body);
    const quoteRef = adminDb.collection('quotes').doc(id);
    const quoteDoc = await quoteRef.get();

    if (!quoteDoc.exists) {
      return res.status(404).json({ success: false, message: 'Quote request not found' });
    }

    await quoteRef.update({
      ...validatedData,
      updated_at: new Date().toISOString()
    });

    const updatedDoc = await quoteRef.get();
    res.json({ success: true, data: updatedDoc.data() });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: error.errors });
    }
    console.error('Update Quote Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update quote' });
  }
};
