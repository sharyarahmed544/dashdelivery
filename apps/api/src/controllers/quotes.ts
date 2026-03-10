import { Request, Response } from 'express';
import { adminDb } from '../lib/firebase';

// Public: Submit Quote Request
export const createQuoteRequest = async (req: Request, res: Response) => {
  const { company_name, contact_name, email, phone, from_country, to_country, service_type, weight, cargo_description, message } = req.body;

  try {
    const quoteRef = adminDb.collection('quotes').doc();
    const quoteData = {
      id: quoteRef.id,
      company_name,
      contact_name,
      email,
      phone,
      from_country,
      to_country,
      service_type,
      weight,
      cargo_description,
      message,
      status: 'NEW',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await quoteRef.set(quoteData);
    res.status(201).json({ success: true, data: quoteData });
  } catch (error) {
    console.error('Create Quote Error:', error);
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
  const { status, price_offered } = req.body;

  try {
    const quoteRef = adminDb.collection('quotes').doc(id);
    await quoteRef.update({
      status,
      price_offered,
      updated_at: new Date().toISOString()
    });
    
    const updatedDoc = await quoteRef.get();
    res.json({ success: true, data: updatedDoc.data() });
  } catch (error) {
    console.error('Update Quote Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update quote' });
  }
};
