import crypto from 'crypto';
import { InsurancePolicy } from '../types/invoice';

const IPT_RATE = 0.12; // 12% Insurance Premium Tax
const PREMIUM_RATE = 0.0075; // 0.75% of declared value
const EXCESS = 150;
const CLAIMS_EMAIL = 'claims@dashdelivery.co.uk';
const UNDERWRITER = "Lloyd's of London Syndicate 4472";

function generate6Digits(): string {
    const buf = crypto.randomBytes(3);
    const num = buf.readUIntBE(0, 3) % 1_000_000;
    return num.toString().padStart(6, '0');
}

function addDays(dateStr: string, days: number): string {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
}

export function generateInsurancePolicy(bookingData: {
    declaredValue: number;
    pickupDate?: string;
    estimatedDeliveryDate?: string;
}): InsurancePolicy {
    const { declaredValue, pickupDate, estimatedDeliveryDate } = bookingData;

    const year = new Date().getFullYear();
    const policyNumber = `DDINS-${year}-${generate6Digits()}`;

    const premiumNet = parseFloat((declaredValue * PREMIUM_RATE).toFixed(2));
    const insurancePremiumTax = parseFloat((premiumNet * IPT_RATE).toFixed(2));
    const premiumTotal = parseFloat((premiumNet + insurancePremiumTax).toFixed(2));

    const validFrom = pickupDate || new Date().toISOString().split('T')[0];
    const deliveryBase = estimatedDeliveryDate || addDays(validFrom, 5);
    const validTo = addDays(deliveryBase, 7);

    return {
        policyNumber,
        coverageAmount: declaredValue,
        iccClause: 'ICC(A)',
        underwriter: UNDERWRITER,
        premiumNet,
        insurancePremiumTax,
        premiumTotal,
        excess: EXCESS,
        validFrom,
        validTo,
        claimsEmail: CLAIMS_EMAIL,
    };
}
