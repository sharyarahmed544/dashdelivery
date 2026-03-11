/**
 * VAT Calculation Service
 * Handles UK/EU VAT compliance logic
 */

export interface VATRate {
    countryCode: string; // UK, DE, FR, etc.
    rate: number; // 20 for 20%
    type: 'STANDARD' | 'REDUCED' | 'ZERO';
}

const DEFAULT_RATES: Record<string, number> = {
    'GB': 20, // UK Standard Rate
    'IE': 23,
    'FR': 20,
    'DE': 19,
};

export const calculateVAT = (amount: number, countryCode: string = 'GB') => {
    const rate = DEFAULT_RATES[countryCode.toUpperCase()] || DEFAULT_RATES['GB'];
    const vatAmount = (amount * rate) / 100;
    const totalWithVAT = amount + vatAmount;

    return {
        netAmount: amount,
        vatRate: rate,
        vatAmount: Number(vatAmount.toFixed(2)),
        total: Number(totalWithVAT.toFixed(2)),
        currency: 'GBP' // Defaulting to GBP for now
    };
};

/**
 * Validates a UK VAT Number (Simplified Luln check)
 */
export const validateUKVatNumber = (vatNumber: string): boolean => {
    const cleanVat = vatNumber.replace(/\s/g, '');
    if (!cleanVat.startsWith('GB')) return false;
    return cleanVat.length === 11; // Basic length check for GB + 9 digits
};
