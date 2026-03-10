import { Request, Response } from 'express';
import { adminDb } from '../lib/firebase';
import { z } from 'zod';
import logger from '../lib/logger';

const ContentBlockSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  cta_text: z.string().optional(),
  cta_url: z.string().optional(),
  is_active: z.boolean().optional(),
});

const SiteSettingSchema = z.object({
  value: z.any(),
});

// Content Blocks
export const getContentBlocks = async (req: Request, res: Response) => {
  try {
    const snapshot = await adminDb.collection('contentBlocks').get();
    const blocks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: blocks });
  } catch (error) {
    logger.error('CMS Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch content blocks' });
  }
};

export const updateContentBlock = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const validatedData = ContentBlockSchema.parse(req.body);
    const { title, body, cta_text, cta_url, is_active } = validatedData;
    const blockRef = adminDb.collection('contentBlocks').doc(id);
    await blockRef.update({
      title,
      body,
      cta_text,
      cta_url,
      is_active,
      updated_at: new Date().toISOString()
    });

    const updatedDoc = await blockRef.get();
    res.json({ success: true, data: updatedDoc.data() });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: error.errors });
    }
    logger.error('Update Content Block Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update content block' });
  }
};

// Site Settings
export const getSiteSettings = async (req: Request, res: Response) => {
  try {
    const snapshot = await adminDb.collection('siteSettings').get();
    const settings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Get Site Settings Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch site settings' });
  }
};

export const updateSiteSetting = async (req: Request, res: Response) => {
  const { key } = req.params;

  try {
    const validatedData = SiteSettingSchema.parse(req.body);
    const { value } = validatedData;
    const settingRef = adminDb.collection('siteSettings').doc(key);
    await settingRef.update({
      value,
      updated_at: new Date().toISOString()
    });

    const updatedDoc = await settingRef.get();
    res.json({ success: true, data: updatedDoc.data() });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: error.errors });
    }
    logger.error('Update Site Setting Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update site setting' });
  }
};
