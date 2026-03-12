import crypto from 'crypto';
import { adminDb } from '../lib/firebase';
import logger from '../lib/logger';

const COUNTRY_CODE_MAP: Record<string, string> = {
    'united kingdom': 'UK',
    'uk': 'UK',
    'gb': 'UK',
    'great britain': 'UK',
    'england': 'UK',
    'scotland': 'UK',
    'wales': 'UK',
    'pakistan': 'PK',
    'france': 'FR',
    'germany': 'DE',
    'saudi arabia': 'SA',
    'netherlands': 'NL',
    'holland': 'NL',
    'uae': 'AE',
    'united arab emirates': 'AE',
    'india': 'IN',
    'ireland': 'IE',
    'republic of ireland': 'IE',
    'usa': 'US',
    'united states': 'US',
    'united states of america': 'US',
};

export function getCountryCode(destinationCountry: string): string {
    const key = destinationCountry.trim().toLowerCase();
    return COUNTRY_CODE_MAP[key] || 'XX';
}

function generate8RandomDigits(): string {
    // Use crypto.randomBytes(4) → 32-bit integer → pad to 8 digits
    const buf = crypto.randomBytes(4);
    const num = buf.readUInt32BE(0) % 100_000_000;
    return num.toString().padStart(8, '0');
}

export async function generateInvoiceNumber(destinationCountry: string): Promise<string> {
    const countryCode = getCountryCode(destinationCountry);
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');

    const MAX_ATTEMPTS = 5;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const digits = generate8RandomDigits();
        const invoiceNumber = `${countryCode}${dd}${mm}${digits}`;

        // Check for collision in Firestore
        const existing = await adminDb.collection('invoices').doc(invoiceNumber).get();
        if (!existing.exists) {
            logger.info(`Generated invoice number: ${invoiceNumber}`);
            return invoiceNumber;
        }
        logger.warn(`Invoice number collision on attempt ${attempt + 1}: ${invoiceNumber}`);
    }

    throw new Error('Failed to generate unique invoice number after 5 attempts');
}
