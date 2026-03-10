import { Request, Response } from 'express';
import { adminDb } from '../lib/firebase';

// Content Blocks
export const getContentBlocks = async (req: Request, res: Response) => {
  try {
    const snapshot = await adminDb.collection('contentBlocks').get();
    const blocks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data: blocks });
  } catch (error) {
    console.error('Get Content Blocks Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch content blocks' });
  }
};

export const updateContentBlock = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, body, cta_text, cta_url, is_active } = req.body;

  try {
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
  } catch (error) {
    console.error('Update Content Block Error:', error);
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
  const { value } = req.body;

  try {
    const settingRef = adminDb.collection('siteSettings').doc(key);
    await settingRef.update({
      value,
      updated_at: new Date().toISOString()
    });
    
    const updatedDoc = await settingRef.get();
    res.json({ success: true, data: updatedDoc.data() });
  } catch (error) {
    console.error('Update Site Setting Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update site setting' });
  }
};
