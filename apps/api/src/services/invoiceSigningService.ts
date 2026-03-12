import crypto from 'crypto';
import { InvoicePayload } from '../types/invoice';

/**
 * Builds a canonical string from the payload for HMAC signing.
 * Keys sorted alphabetically, numbers rounded to 2dp, no whitespace.
 */
function buildCanonicalString(payload: InvoicePayload): string {
    const sanitised = JSON.parse(JSON.stringify(payload, (_, value) => {
        if (typeof value === 'number') return parseFloat(value.toFixed(2));
        return value;
    }));

    const sortKeys = (obj: any): any => {
        if (Array.isArray(obj)) return obj.map(sortKeys);
        if (obj !== null && typeof obj === 'object') {
            return Object.keys(obj).sort().reduce((acc: any, k) => {
                acc[k] = sortKeys(obj[k]);
                return acc;
            }, {});
        }
        return obj;
    };

    return JSON.stringify(sortKeys(sanitised));
}

export function signInvoice(payload: InvoicePayload): string {
    const key = process.env.INVOICE_SIGNING_KEY;
    if (!key) throw new Error('INVOICE_SIGNING_KEY environment variable is not set');

    const canonical = buildCanonicalString(payload);
    return crypto.createHmac('sha256', key).update(canonical).digest('hex');
}

export function verifyInvoiceSignature(payload: InvoicePayload, signature: string): boolean {
    const key = process.env.INVOICE_SIGNING_KEY;
    if (!key) throw new Error('INVOICE_SIGNING_KEY environment variable is not set');

    const canonical = buildCanonicalString(payload);
    const expected = crypto.createHmac('sha256', key).update(canonical).digest('hex');

    // Constant-time comparison to prevent timing attacks
    const expectedBuf = Buffer.from(expected, 'hex');
    const providedBuf = Buffer.from(signature.padEnd(expected.length, '0').slice(0, expected.length), 'hex');

    if (expectedBuf.length !== providedBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, providedBuf);
}
