import * as dotenv from 'dotenv';
dotenv.config();
import * as admin from 'firebase-admin';
import logger from './logger';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        // Support both snake_case and camelCase for different SDK versions
        project_id: process.env.FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      } as any),
      storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
    });
    logger.info('Firebase Admin initialized successfully');
  } catch (error) {
    logger.error('Firebase admin initialization error', error);
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminStorage = admin.storage();
export default admin;
