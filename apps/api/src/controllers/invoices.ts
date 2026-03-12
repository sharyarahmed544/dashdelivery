import { Request, Response } from 'express';
import { adminDb, adminStorage } from '../lib/firebase';
import logger from '../lib/logger';
import { logAuditAction } from '../lib/audit';
import { generateInvoiceNumber, getCountryCode } from '../services/invoiceNumberService';
import { signInvoice, verifyInvoiceSignature } from '../services/invoiceSigningService';
import { generateInvoicePdf, uploadInvoicePdf } from '../services/invoicePdfService';
import { generateInsurancePolicy } from '../services/insuranceService';
import { determineVatRate, calculateLineItemVat, buildVatBreakdown } from '../services/vatService';
import { sendInvoiceEmail } from '../services/emailService';
import { InvoicePayload, InvoiceStatus, LineItem, InvoiceRecord } from '../types/invoice';

const SUPPLIER = {
    name: 'Dash Delivery Ltd',
    addressLine1: '123 Logistics Way',
    city: 'London',
    postcode: 'EC1A 1BB',
    country: 'GB',
    countryName: 'United Kingdom',
    vatNumber: 'GB123456789',
    email: 'accounts@dashdelivery.co.uk',
    phone: '+44 20 7946 0000',
};

const BANK_DETAILS = {
    bankName: 'Barclays Bank PLC',
    sortCode: '20-00-00',
    accountNumber: '12345678',
    iban: 'GB29 BARC 2000 0012 3456 78',
    bic: 'BARCGB22',
};

function buildLineItems(booking: any, includeInsurance: boolean, insurancePolicy?: any): LineItem[] {
    const destCountry = booking.destination_country || booking.delivery_country || 'GB';
    const origin = booking.pickup_country || 'GB';
    const serviceType = booking.service_type || 'STANDARD';
    const weight = booking.weight || 1;

    const items: Omit<LineItem, 'vatAmount' | 'totalAmount'>[] = [];
    let lineNum = 1;

    // Freight charge
    const freightVat = determineVatRate(serviceType, origin, destCountry);
    const freightNet = booking.estimated_price || (weight * 12);
    items.push({
        lineNumber: lineNum++,
        description: `${serviceType} Freight — ${origin} to ${destCountry}`,
        hsCode: '860900',
        quantity: 1,
        unitPrice: freightNet,
        vatRate: freightVat,
        netAmount: freightNet,
    });

    // Fuel surcharge (follows freight VAT rate)
    const fuelCharge = parseFloat((freightNet * 0.035).toFixed(2));
    items.push({
        lineNumber: lineNum++,
        description: 'Fuel Surcharge (3.5%)',
        hsCode: '',
        quantity: 1,
        unitPrice: fuelCharge,
        vatRate: freightVat,
        netAmount: fuelCharge,
    });

    // Insurance premium (IPT 12%)
    if (includeInsurance && booking.declared_value && insurancePolicy) {
        items.push({
            lineNumber: lineNum++,
            description: `Cargo Insurance — ICC(A) All-Risks — Policy ${insurancePolicy.policyNumber}`,
            hsCode: '',
            quantity: 1,
            unitPrice: insurancePolicy.premiumNet,
            vatRate: 12,
            netAmount: insurancePolicy.premiumNet,
        });
    }

    // Customs handling (always 20% UK VAT)
    const isInternational = destCountry.toUpperCase() !== 'GB' && destCountry.toUpperCase() !== 'UK';
    if (isInternational) {
        items.push({
            lineNumber: lineNum++,
            description: 'Customs Handling & Documentation',
            hsCode: '',
            quantity: 1,
            unitPrice: 25.00,
            vatRate: 20,
            netAmount: 25.00,
        });
    }

    return items.map(i => calculateLineItemVat(i));
}

// ── POST /admin/invoices/generate ────────────────────────────────────────────
export const generateInvoice = async (req: Request, res: Response) => {
    const { bookingId, language = 'en', sendEmail = false, includeInsurance = false } = req.body;
    if (!bookingId) return res.status(400).json({ success: false, message: 'bookingId is required' });

    try {
        const bookingDoc = await adminDb.collection('bookings').doc(bookingId).get();
        if (!bookingDoc.exists) return res.status(404).json({ success: false, message: 'Booking not found' });
        const booking = bookingDoc.data()!;

        const destCountry = booking.destination_country || booking.delivery_country || 'United Kingdom';
        const invoiceNumber = await generateInvoiceNumber(destCountry);

        const now = new Date();
        const dueDate = new Date(now.getTime() + 14 * 86400000);
        const issueDate = now.toISOString().split('T')[0];
        const dueDateStr = dueDate.toISOString().split('T')[0];

        let insurancePolicy;
        if (includeInsurance && booking.declared_value) {
            insurancePolicy = generateInsurancePolicy({
                declaredValue: booking.declared_value,
                pickupDate: booking.pickup_date || issueDate,
            });
        }

        const lineItems = buildLineItems(booking, includeInsurance, insurancePolicy);
        const vatBreakdown = buildVatBreakdown(lineItems);
        const subtotalNet = parseFloat(lineItems.reduce((s, i) => s + i.netAmount, 0).toFixed(2));
        const totalVat = parseFloat(lineItems.reduce((s, i) => s + i.vatAmount, 0).toFixed(2));
        const totalGross = parseFloat((subtotalNet + totalVat).toFixed(2));

        const paymentReference = `DDPAY-${invoiceNumber}`;
        const verifyUrl = `https://verify.dashdelivery.co.uk/inv/${invoiceNumber}`;

        const payload: InvoicePayload = {
            invoiceNumber,
            bookingId,
            issueDate,
            dueDate: dueDateStr,
            paymentTerms: 'Net 14',
            currency: 'GBP',
            language,
            supplier: SUPPLIER,
            customer: {
                name: booking.customer_name || booking.sender_name || 'Customer',
                addressLine1: booking.pickup_address || '—',
                city: '',
                postcode: booking.pickup_postcode || '',
                country: getCountryCode(booking.pickup_country || 'United Kingdom'),
                countryName: booking.pickup_country || 'United Kingdom',
                email: booking.email || booking.customer_email,
                phone: booking.customer_phone,
            },
            lineItems,
            vatBreakdown,
            subtotalNet,
            totalVat,
            totalGross,
            totalDue: totalGross,
            trackingNumber: booking.tracking_number,
            serviceType: booking.service_type,
            originCountry: booking.pickup_country || 'United Kingdom',
            destinationCountry: destCountry,
            grossWeightKg: booking.weight,
            customsDeclaration: {
                originCountry: booking.pickup_country || 'United Kingdom',
                destinationCountry: destCountry,
                declaredValue: booking.declared_value || totalGross,
                incoterms: booking.incoterms || 'DAP',
                goodsDescription: booking.package_description || booking.cargo_description || 'General Cargo',
                hsCode: booking.hs_code,
                grossWeightKg: booking.weight || 1,
                numberOfPackages: booking.quantity || 1,
                isDangerousGoods: booking.is_dangerous_goods || false,
                exporterEori: booking.exporter_eori,
                ukMrnRef: booking.uk_mrn_ref,
            },
            insurancePolicy,
            ...BANK_DETAILS,
            paymentReference,
            verifyUrl,
        };

        // Sign payload
        const hmacSignature = signInvoice(payload);
        payload.hmacSignature = hmacSignature;

        // Generate PDF
        const pdfBuffer = await generateInvoicePdf(payload);

        // Upload to Firebase Storage
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const storagePath = `invoices/${year}/${month}/${invoiceNumber}.pdf`;
        const downloadUrl = await uploadInvoicePdf(pdfBuffer, storagePath);

        // Save to Firestore (doc ID = invoiceNumber)
        const record: InvoiceRecord = {
            invoiceNumber,
            bookingId,
            status: InvoiceStatus.ISSUED,
            customerName: payload.customer.name,
            customerEmail: payload.customer.email,
            totalDue: totalGross,
            currency: 'GBP',
            issueDate,
            dueDate: dueDateStr,
            pdfStoragePath: storagePath,
            downloadUrl,
            hmacSignature,
            payload,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
        };
        await adminDb.collection('invoices').doc(invoiceNumber).set(record);

        // Update booking with invoice reference
        await adminDb.collection('bookings').doc(bookingId).update({
            invoice_number: invoiceNumber,
            updated_at: now.toISOString(),
        });

        await logAuditAction({
            admin_id: (req as any).user?.userId || 'system',
            admin_email: (req as any).user?.email || 'system',
            action: 'GENERATE_INVOICE',
            resource_id: invoiceNumber,
            details: { bookingId, totalDue: totalGross },
            ip_address: req.ip,
        });

        // Optionally send email
        if (sendEmail && payload.customer.email) {
            await sendInvoiceEmail({
                to: payload.customer.email,
                customerName: payload.customer.name,
                invoiceNumber,
                totalDue: totalGross,
                currency: 'GBP',
                dueDate: dueDateStr,
                pdfBuffer,
                trackingNumber: booking.tracking_number,
                verifyUrl,
            });
            await adminDb.collection('invoices').doc(invoiceNumber).update({
                status: InvoiceStatus.SENT,
                updatedAt: new Date().toISOString(),
            });
        }

        return res.status(201).json({
            success: true,
            data: { invoiceNumber, downloadUrl, signature: hmacSignature, trackingNumber: booking.tracking_number },
        });
    } catch (error: any) {
        logger.error('Generate Invoice Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to generate invoice' });
    }
};

// ── GET /admin/invoices ───────────────────────────────────────────────────────
export const getInvoices = async (req: Request, res: Response) => {
    try {
        const { status, dateFrom, dateTo, search } = req.query;

        let query: FirebaseFirestore.Query = adminDb.collection('invoices').orderBy('createdAt', 'desc');

        if (status) query = query.where('status', '==', status);
        if (dateFrom) query = query.where('issueDate', '>=', dateFrom);
        if (dateTo) query = query.where('issueDate', '<=', dateTo);

        const snapshot = await query.limit(100).get();
        let invoices = snapshot.docs.map(doc => {
            const d = doc.data();
            // Return summary — omit full payload to keep response lean
            const { payload, ...summary } = d;
            return summary;
        });

        // Client-side search filter (Firestore doesn't support full-text)
        if (search && typeof search === 'string') {
            const q = search.toLowerCase();
            invoices = invoices.filter(inv =>
                inv.invoiceNumber?.toLowerCase().includes(q) ||
                inv.customerName?.toLowerCase().includes(q)
            );
        }

        return res.json({ success: true, data: invoices, total: invoices.length });
    } catch (error) {
        logger.error('Get Invoices Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch invoices' });
    }
};

// ── GET /admin/invoices/:invoiceNumber ────────────────────────────────────────
export const getInvoice = async (req: Request, res: Response) => {
    const { invoiceNumber } = req.params;
    try {
        const doc = await adminDb.collection('invoices').doc(invoiceNumber).get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Invoice not found' });
        return res.json({ success: true, data: doc.data() });
    } catch (error) {
        logger.error('Get Invoice Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch invoice' });
    }
};

// ── POST /admin/invoices/:invoiceNumber/send ──────────────────────────────────
export const sendInvoice = async (req: Request, res: Response) => {
    const { invoiceNumber } = req.params;
    try {
        const doc = await adminDb.collection('invoices').doc(invoiceNumber).get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Invoice not found' });
        const record = doc.data() as InvoiceRecord;

        if (!record.customerEmail) {
            return res.status(400).json({ success: false, message: 'No customer email on record' });
        }

        // Regenerate PDF if no storage path or fetch from storage
        let pdfBuffer: Buffer;
        if (record.pdfStoragePath) {
            const [buf] = await adminStorage.bucket().file(record.pdfStoragePath).download();
            pdfBuffer = buf;
        } else {
            pdfBuffer = await generateInvoicePdf(record.payload);
        }

        await sendInvoiceEmail({
            to: record.customerEmail,
            customerName: record.customerName,
            invoiceNumber,
            totalDue: record.totalDue,
            currency: record.currency,
            dueDate: record.dueDate,
            pdfBuffer,
            verifyUrl: record.payload.verifyUrl || `https://verify.dashdelivery.co.uk/inv/${invoiceNumber}`,
        });

        await doc.ref.update({ status: InvoiceStatus.SENT, updatedAt: new Date().toISOString() });

        await logAuditAction({
            admin_id: (req as any).user?.userId || 'system',
            admin_email: (req as any).user?.email || 'system',
            action: 'SEND_INVOICE',
            resource_id: invoiceNumber,
            details: { to: record.customerEmail },
            ip_address: req.ip,
        });

        return res.json({ success: true, message: 'Invoice sent' });
    } catch (error) {
        logger.error('Send Invoice Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to send invoice' });
    }
};

// ── POST /admin/invoices/:invoiceNumber/mark-paid ─────────────────────────────
export const markPaid = async (req: Request, res: Response) => {
    const { invoiceNumber } = req.params;
    const { paidAmount, paymentMethod } = req.body;

    try {
        const ref = adminDb.collection('invoices').doc(invoiceNumber);
        const doc = await ref.get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Invoice not found' });

        const now = new Date().toISOString();
        await ref.update({
            status: InvoiceStatus.PAID,
            paidAt: now,
            paidAmount,
            paymentMethod,
            updatedAt: now,
        });

        await logAuditAction({
            admin_id: (req as any).user?.userId || 'system',
            admin_email: (req as any).user?.email || 'system',
            action: 'MARK_INVOICE_PAID',
            resource_id: invoiceNumber,
            details: { paidAmount, paymentMethod },
            ip_address: req.ip,
        });

        return res.json({ success: true, data: { invoiceNumber, status: InvoiceStatus.PAID, paidAt: now } });
    } catch (error) {
        logger.error('Mark Paid Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to update invoice' });
    }
};

// ── POST /admin/invoices/:invoiceNumber/void ──────────────────────────────────
export const voidInvoice = async (req: Request, res: Response) => {
    const { invoiceNumber } = req.params;
    try {
        const ref = adminDb.collection('invoices').doc(invoiceNumber);
        const doc = await ref.get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Invoice not found' });

        const now = new Date().toISOString();
        await ref.update({ status: InvoiceStatus.VOID, updatedAt: now });

        await logAuditAction({
            admin_id: (req as any).user?.userId || 'system',
            admin_email: (req as any).user?.email || 'system',
            action: 'VOID_INVOICE',
            resource_id: invoiceNumber,
            details: {},
            ip_address: req.ip,
        });

        return res.json({ success: true, data: { invoiceNumber, status: InvoiceStatus.VOID } });
    } catch (error) {
        logger.error('Void Invoice Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to void invoice' });
    }
};

// ── GET /admin/invoices/vat-report ────────────────────────────────────────────
export const getVatReport = async (req: Request, res: Response) => {
    const { month } = req.query; // e.g. '2026-03'
    if (!month || typeof month !== 'string' || !/^\d{4}-\d{2}$/.test(month)) {
        return res.status(400).json({ success: false, message: 'month param required, format: YYYY-MM' });
    }

    try {
        const [year, mo] = month.split('-');
        const from = `${year}-${mo}-01`;
        const nextMonth = new Date(parseInt(year), parseInt(mo), 1);
        const to = nextMonth.toISOString().split('T')[0];

        const snapshot = await adminDb.collection('invoices')
            .where('issueDate', '>=', from)
            .where('issueDate', '<', to)
            .where('status', '!=', InvoiceStatus.VOID)
            .get();

        const totals: Record<string, { rate: number; netAmount: number; vatAmount: number; description: string }> = {};

        snapshot.docs.forEach(doc => {
            const data = doc.data() as InvoiceRecord;
            (data.payload?.vatBreakdown || []).forEach(vb => {
                const key = String(vb.rate);
                if (!totals[key]) {
                    totals[key] = { rate: vb.rate, netAmount: 0, vatAmount: 0, description: vb.description };
                }
                totals[key].netAmount = parseFloat((totals[key].netAmount + vb.netAmount).toFixed(2));
                totals[key].vatAmount = parseFloat((totals[key].vatAmount + vb.vatAmount).toFixed(2));
            });
        });

        const breakdown = Object.values(totals).sort((a, b) => a.rate - b.rate);
        const totalNet = parseFloat(breakdown.reduce((s, b) => s + b.netAmount, 0).toFixed(2));
        const totalVat = parseFloat(breakdown.reduce((s, b) => s + b.vatAmount, 0).toFixed(2));
        const invoiceCount = snapshot.size;

        return res.json({
            success: true,
            data: { month, invoiceCount, totalNet, totalVat, totalGross: parseFloat((totalNet + totalVat).toFixed(2)), breakdown },
        });
    } catch (error) {
        logger.error('VAT Report Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to generate VAT report' });
    }
};

// ── GET /admin/invoices/:invoiceNumber/pdf ────────────────────────────────────
export const downloadInvoicePdf = async (req: Request, res: Response) => {
    const { invoiceNumber } = req.params;
    try {
        const doc = await adminDb.collection('invoices').doc(invoiceNumber).get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Invoice not found' });

        const record = doc.data() as InvoiceRecord;
        let pdfBuffer: Buffer;

        if (record.pdfStoragePath) {
            const [buf] = await adminStorage.bucket().file(record.pdfStoragePath).download();
            pdfBuffer = buf;
        } else {
            pdfBuffer = await generateInvoicePdf(record.payload);
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${invoiceNumber}.pdf"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        return res.send(pdfBuffer);
    } catch (error) {
        logger.error('Download PDF Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to download PDF' });
    }
};

// ── GET /api/v1/verify/:invoiceNumber (PUBLIC) ────────────────────────────────
export const verifyInvoice = async (req: Request, res: Response) => {
    const { invoiceNumber } = req.params;
    const { sig } = req.query;

    const verifiedAt = new Date().toISOString();

    try {
        const doc = await adminDb.collection('invoices').doc(invoiceNumber).get();

        // Log every attempt (hit or miss)
        await logAuditAction({
            admin_id: 'PUBLIC',
            admin_email: 'public',
            action: 'VERIFY_INVOICE',
            resource_id: invoiceNumber,
            details: { ip: req.ip, result: doc.exists ? 'found' : 'not_found' },
            ip_address: req.ip,
        });

        if (!doc.exists) {
            return res.status(404).json({ valid: false, message: 'Invoice not found', verifiedAt });
        }

        const record = doc.data() as InvoiceRecord;
        const sigStr = typeof sig === 'string' ? sig : '';

        const valid = verifyInvoiceSignature(record.payload, sigStr);

        return res.json({
            valid,
            invoiceNumber,
            issuedAt: record.issueDate,
            totalDue: record.totalDue,
            status: record.status,
            supplier: record.payload.supplier?.name,
            customer: record.payload.customer?.name,
            verifiedAt,
            algorithm: 'HMAC-SHA256',
        });
    } catch (error) {
        logger.error('Verify Invoice Error:', error);
        return res.status(500).json({ valid: false, message: 'Verification service unavailable', verifiedAt });
    }
};

// Keep old stubs for backward compat with existing admin.ts import
export const updateInvoiceStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, message: 'status is required' });

    try {
        const ref = adminDb.collection('invoices').doc(id);
        const doc = await ref.get();
        if (!doc.exists) return res.status(404).json({ success: false, message: 'Invoice not found' });
        await ref.update({ status, updatedAt: new Date().toISOString() });
        return res.json({ success: true, data: { id, status } });
    } catch (error) {
        logger.error('Update Invoice Status Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to update invoice' });
    }
};
