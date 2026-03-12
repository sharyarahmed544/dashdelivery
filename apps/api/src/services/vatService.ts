import { LineItem, VatBreakdown } from '../types/invoice';

/**
 * VAT Calculation Service
 * Handles UK/EU VAT compliance logic
 */

export interface VATRate {
    countryCode: string;
    rate: number;
    type: 'STANDARD' | 'REDUCED' | 'ZERO';
}

// Standard VAT rates per country (ISO alpha-2)
const EU_VAT_RATES: Record<string, number> = {
    'AT': 20, // Austria
    'BE': 21, // Belgium
    'BG': 20, // Bulgaria
    'CY': 19, // Cyprus
    'CZ': 21, // Czech Republic
    'DE': 19, // Germany
    'DK': 25, // Denmark
    'EE': 22, // Estonia
    'ES': 21, // Spain
    'FI': 24, // Finland
    'FR': 20, // France
    'GR': 24, // Greece
    'HR': 25, // Croatia
    'HU': 27, // Hungary
    'IE': 23, // Ireland
    'IT': 22, // Italy
    'LT': 21, // Lithuania
    'LU': 17, // Luxembourg
    'LV': 21, // Latvia
    'MT': 18, // Malta
    'NL': 21, // Netherlands
    'PL': 23, // Poland
    'PT': 23, // Portugal
    'RO': 19, // Romania
    'SE': 25, // Sweden
    'SI': 22, // Slovenia
    'SK': 20, // Slovakia
};

const DEFAULT_RATES: Record<string, number> = {
    'GB': 20,
    'UK': 20,
    ...EU_VAT_RATES,
};

const FREIGHT_SERVICE_TYPES = ['STANDARD', 'EXPRESS', 'SAME_DAY', 'PALLET', 'DOCUMENT', 'freight'];

// HMRC Notice 700/24: international freight zero-rated when destination is outside GB
export function determineVatRate(
    serviceType: string,
    originCountry: string,
    destinationCountry: string
): number {
    const dest = destinationCountry.trim().toUpperCase();
    const isFreight = FREIGHT_SERVICE_TYPES.some(t =>
        serviceType.toUpperCase().includes(t.toUpperCase())
    );

    if (isFreight && dest !== 'GB' && dest !== 'UK') {
        return 0; // Zero-rated international freight per HMRC Notice 700/24
    }

    if (serviceType === 'INSURANCE_PREMIUM') {
        return 12; // IPT rate — not VAT
    }

    // Customs handling is always 20% UK VAT
    if (serviceType === 'CUSTOMS_HANDLING') {
        return 20;
    }

    return DEFAULT_RATES[dest] || 20;
}

export function calculateLineItemVat(item: Omit<LineItem, 'vatAmount' | 'totalAmount'>): LineItem {
    const netAmount = parseFloat((item.unitPrice * item.quantity).toFixed(2));
    const vatAmount = parseFloat((netAmount * item.vatRate / 100).toFixed(2));
    const totalAmount = parseFloat((netAmount + vatAmount).toFixed(2));
    return { ...item, netAmount, vatAmount, totalAmount };
}

export function buildVatBreakdown(items: LineItem[]): VatBreakdown[] {
    const map = new Map<number, VatBreakdown>();

    for (const item of items) {
        const existing = map.get(item.vatRate);
        if (existing) {
            existing.netAmount = parseFloat((existing.netAmount + item.netAmount).toFixed(2));
            existing.vatAmount = parseFloat((existing.vatAmount + item.vatAmount).toFixed(2));
        } else {
            const desc = item.vatRate === 12
                ? 'Insurance Premium Tax (IPT)'
                : item.vatRate === 0
                    ? 'Zero-rated (International Freight — HMRC 700/24)'
                    : `Standard Rate VAT ${item.vatRate}%`;
            map.set(item.vatRate, {
                rate: item.vatRate,
                netAmount: item.netAmount,
                vatAmount: item.vatAmount,
                description: desc,
            });
        }
    }

    return Array.from(map.values()).sort((a, b) => a.rate - b.rate);
}

// Legacy helper kept for backward compatibility
export const calculateVAT = (amount: number, countryCode: string = 'GB') => {
    const rate = DEFAULT_RATES[countryCode.toUpperCase()] ?? DEFAULT_RATES['GB'];
    const vatAmount = (amount * rate) / 100;
    const totalWithVAT = amount + vatAmount;

    return {
        netAmount: amount,
        vatRate: rate,
        vatAmount: Number(vatAmount.toFixed(2)),
        total: Number(totalWithVAT.toFixed(2)),
        currency: 'GBP',
    };
};

export const validateUKVatNumber = (vatNumber: string): boolean => {
    const cleanVat = vatNumber.replace(/\s/g, '');
    if (!cleanVat.startsWith('GB')) return false;
    return cleanVat.length === 11;
};
