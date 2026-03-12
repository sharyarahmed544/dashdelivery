export enum InvoiceStatus {
    DRAFT = 'DRAFT',
    ISSUED = 'ISSUED',
    SENT = 'SENT',
    PAID = 'PAID',
    OVERDUE = 'OVERDUE',
    VOID = 'VOID',
}

export interface LineItem {
    lineNumber: number;
    description: string;
    hsCode?: string;
    quantity: number;
    unitPrice: number;
    vatRate: number;       // 0, 12, 20 — IPT uses 12
    vatAmount: number;
    netAmount: number;     // unitPrice * quantity
    totalAmount: number;   // netAmount + vatAmount
}

export interface VatBreakdown {
    rate: number;
    netAmount: number;
    vatAmount: number;
    description: string;
}

export interface PartyDetails {
    name: string;
    addressLine1: string;
    city: string;
    postcode: string;
    country: string;       // ISO alpha-2
    countryName: string;
    vatNumber?: string;
    email?: string;
    phone?: string;
}

export interface CustomsDeclaration {
    originCountry: string;
    destinationCountry: string;
    declaredValue: number;
    incoterms: string;
    goodsDescription: string;
    hsCode?: string;
    grossWeightKg: number;
    numberOfPackages: number;
    isDangerousGoods: boolean;
    exporterEori?: string;
    ukMrnRef?: string;
}

export interface InsurancePolicy {
    policyNumber: string;
    coverageAmount: number;
    iccClause: string;          // 'ICC(A)'
    underwriter: string;        // "Lloyd's of London Syndicate 4472"
    premiumNet: number;
    insurancePremiumTax: number; // 12% IPT
    premiumTotal: number;
    excess: number;             // 150
    validFrom: string;          // ISO date
    validTo: string;            // ISO date
    claimsEmail: string;
}

export interface InvoicePayload {
    invoiceNumber: string;
    bookingId?: string;
    quoteId?: string;
    issueDate: string;
    dueDate: string;
    paymentTerms: string;       // 'Net 14'
    currency: string;           // 'GBP'
    language: string;           // 'en'
    supplier: PartyDetails;
    customer: PartyDetails;
    lineItems: LineItem[];
    vatBreakdown: VatBreakdown[];
    subtotalNet: number;
    totalVat: number;
    totalGross: number;
    discount?: number;
    totalDue: number;
    trackingNumber?: string;
    serviceType?: string;
    originCountry?: string;
    destinationCountry?: string;
    grossWeightKg?: number;
    customsDeclaration?: CustomsDeclaration;
    insurancePolicy?: InsurancePolicy;
    bankName: string;
    sortCode: string;
    accountNumber: string;
    iban: string;
    bic: string;
    paymentReference: string;
    hmacSignature?: string;
    verifyUrl?: string;
}

export interface InvoiceRecord {
    invoiceNumber: string;
    bookingId?: string;
    quoteId?: string;
    status: InvoiceStatus;
    customerName: string;
    customerEmail?: string;
    totalDue: number;
    currency: string;
    issueDate: string;
    dueDate: string;
    paidAt?: string;
    paidAmount?: number;
    paymentMethod?: string;
    pdfStoragePath?: string;
    downloadUrl?: string;
    hmacSignature: string;
    payload: InvoicePayload;
    createdAt: string;
    updatedAt: string;
}
