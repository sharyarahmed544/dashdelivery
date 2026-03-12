import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { InvoicePayload } from '../types/invoice';
import { adminStorage } from '../lib/firebase';

// ── Colour palette ──────────────────────────────────────────────────────────
const C = {
    orange:       '#FF5C35',
    orangeSoft:   '#FF5C3520',
    darkBg:       '#0A0D14',
    darkMeta:     '#1E2433',
    surface:      '#F4F6FB',
    blue:         '#1E3A5F',
    blueSoft:     '#EFF6FF',
    amber:        '#92400E',
    amberSoft:    '#FEF3C7',
    securityBg:   '#1C2B4B',
    white:        '#FFFFFF',
    text:         '#1E293B',
    muted:        '#64748B',
    border:       '#E2E8F0',
    green:        '#22C55E',
    greenSoft:    '#F0FDF4',
};

const PAGE_W = 595.28;
const MARGIN = 40;
const CONTENT_W = PAGE_W - MARGIN * 2;

function hex(color: string): [number, number, number] {
    const c = color.replace('#', '');
    return [parseInt(c.slice(0,2),16), parseInt(c.slice(2,4),16), parseInt(c.slice(4,6),16)];
}

function drawRect(doc: PDFKit.PDFDocument, x: number, y: number, w: number, h: number, color: string, stroke?: string) {
    doc.save();
    if (stroke) {
        doc.roundedRect(x, y, w, h, 4).fillAndStroke(color, stroke);
    } else {
        doc.rect(x, y, w, h).fill(color);
    }
    doc.restore();
}

function text(doc: PDFKit.PDFDocument, str: string, x: number, y: number, options: any = {}) {
    doc.text(str, x, y, { lineBreak: false, ...options });
}

export async function generateInvoicePdf(payload: InvoicePayload): Promise<Buffer> {
    const verifyUrl = payload.verifyUrl || `https://verify.dashdelivery.co.uk/inv/${payload.invoiceNumber}`;
    const qrBuffer = await QRCode.toBuffer(verifyUrl, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 80,
        color: { dark: C.orange, light: C.white },
    });

    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margin: 0, bufferPages: true });
        const chunks: Buffer[] = [];
        doc.on('data', (c: Buffer) => chunks.push(c));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        let y = 0;

        // ── 1. Top orange accent strip ────────────────────────────────────
        drawRect(doc, 0, 0, PAGE_W, 4, C.orange);
        y = 4;

        // ── 2. Header band ────────────────────────────────────────────────
        drawRect(doc, 0, y, PAGE_W, 72, C.darkBg);

        // DD logo box
        drawRect(doc, MARGIN, y + 16, 36, 36, C.orange);
        doc.fillColor(C.white).font('Helvetica-Bold').fontSize(16);
        text(doc, 'DD', MARGIN + 6, y + 24);

        // Company name & tagline
        doc.fillColor(C.white).font('Helvetica-Bold').fontSize(14);
        text(doc, 'DashDelivery', MARGIN + 46, y + 20);
        doc.fillColor(C.muted).font('Helvetica').fontSize(8);
        text(doc, 'Premium Global Logistics & Freight Solutions', MARGIN + 46, y + 38);
        doc.fillColor(C.muted).fontSize(7);
        text(doc, 'VAT Reg: GB123456789  |  EORI: GB123456789000', MARGIN + 46, y + 50);

        // TAX INVOICE badge
        drawRect(doc, PAGE_W - MARGIN - 110, y + 18, 110, 32, C.orange);
        doc.fillColor(C.white).font('Helvetica-Bold').fontSize(11);
        text(doc, 'TAX INVOICE', PAGE_W - MARGIN - 104, y + 28, { width: 98, align: 'center' });

        y += 76;

        // ── 3. Meta row ───────────────────────────────────────────────────
        drawRect(doc, 0, y, PAGE_W, 34, C.darkMeta);
        const metas = [
            { label: 'Invoice No', value: payload.invoiceNumber },
            { label: 'Issue Date', value: new Date(payload.issueDate).toLocaleDateString('en-GB') },
            { label: 'Due Date', value: new Date(payload.dueDate).toLocaleDateString('en-GB') },
            { label: 'Terms', value: payload.paymentTerms },
            { label: 'Booking Ref', value: payload.bookingId || '—' },
            { label: 'Currency', value: payload.currency },
        ];
        const metaW = CONTENT_W / metas.length;
        metas.forEach((m, i) => {
            const mx = MARGIN + i * metaW;
            doc.fillColor(C.muted).font('Helvetica').fontSize(6.5);
            text(doc, m.label.toUpperCase(), mx, y + 6);
            doc.fillColor(C.white).font('Helvetica-Bold').fontSize(7.5);
            text(doc, m.value, mx, y + 17);
        });
        y += 38;

        // ── 4. Compliance banner ──────────────────────────────────────────
        drawRect(doc, 0, y, PAGE_W, 20, C.blueSoft);
        doc.fillColor(C.blue).font('Helvetica-Bold').fontSize(7);
        text(doc, 'HMRC VAT Notice 700 Compliant  ·  EU Directive 2006/112/EC  ·  Digitally Signed (HMAC-SHA256)', MARGIN, y + 6, { width: CONTENT_W, align: 'center' });
        y += 24;

        // ── 5. Parties section ────────────────────────────────────────────
        const partyW = (CONTENT_W - 12) / 2;

        const drawParty = (title: string, party: typeof payload.supplier, px: number, py: number) => {
            drawRect(doc, px, py, partyW, 110, C.surface, C.border);
            doc.fillColor(C.orange).font('Helvetica-Bold').fontSize(7.5);
            text(doc, title, px + 10, py + 10);
            doc.moveTo(px + 10, py + 21).lineTo(px + 10 + partyW - 20, py + 21).strokeColor(C.border).lineWidth(0.5).stroke();
            doc.fillColor(C.text).font('Helvetica-Bold').fontSize(9);
            text(doc, party.name, px + 10, py + 28);
            doc.font('Helvetica').fontSize(8).fillColor(C.muted);
            text(doc, party.addressLine1, px + 10, py + 42);
            text(doc, `${party.city}  ${party.postcode}`, px + 10, py + 53);
            text(doc, party.countryName, px + 10, py + 64);
            if (party.vatNumber) text(doc, `VAT: ${party.vatNumber}`, px + 10, py + 77);
            if (party.email) text(doc, party.email, px + 10, py + 89);
        };

        drawParty('FROM', payload.supplier, MARGIN, y);
        drawParty('BILL TO', payload.customer, MARGIN + partyW + 12, y);
        y += 118;

        // ── 6. Shipment summary ───────────────────────────────────────────
        drawRect(doc, MARGIN, y, CONTENT_W, 50, C.darkBg);
        doc.fillColor(C.muted).font('Helvetica').fontSize(7);
        text(doc, 'TRACKING NUMBER', MARGIN + 10, y + 8);
        doc.fillColor(C.orange).font('Helvetica-Bold').fontSize(11);
        text(doc, payload.trackingNumber || '—', MARGIN + 10, y + 19);

        const shipMetas = [
            { l: 'ROUTE', v: `${payload.originCountry || '—'} → ${payload.destinationCountry || '—'}` },
            { l: 'SERVICE', v: payload.serviceType || '—' },
            { l: 'WEIGHT', v: payload.grossWeightKg ? `${payload.grossWeightKg} KG` : '—' },
            { l: 'STATUS', v: 'ISSUED' },
        ];
        shipMetas.forEach((m, i) => {
            const sx = MARGIN + 160 + i * 90;
            doc.fillColor(C.muted).font('Helvetica').fontSize(6.5);
            text(doc, m.l, sx, y + 8);
            doc.fillColor(C.white).font('Helvetica-Bold').fontSize(8);
            text(doc, m.v, sx, y + 19);
        });
        y += 58;

        // ── 7. Line items table ───────────────────────────────────────────
        const colX = [MARGIN, MARGIN+20, MARGIN+195, MARGIN+270, MARGIN+330, MARGIN+380, MARGIN+420, MARGIN+470];
        const colW = PAGE_W - MARGIN - colX[7];
        const headers = ['#', 'Description', 'HS Code', 'Qty', 'Unit Price', 'VAT%', 'Net', 'Total'];

        // Table header
        drawRect(doc, MARGIN, y, CONTENT_W, 22, C.darkBg);
        doc.fillColor(C.muted).font('Helvetica-Bold').fontSize(7);
        headers.forEach((h, i) => text(doc, h, colX[i] + 3, y + 7));
        y += 22;

        payload.lineItems.forEach((item, idx) => {
            const rowH = 22;
            const bg = idx % 2 === 0 ? C.white : C.surface;
            drawRect(doc, MARGIN, y, CONTENT_W, rowH, bg);
            doc.fillColor(C.text).font('Helvetica').fontSize(7.5);
            text(doc, String(item.lineNumber), colX[0] + 3, y + 7);
            text(doc, item.description, colX[1] + 3, y + 7, { width: 170, lineBreak: false });
            text(doc, item.hsCode || '—', colX[2] + 3, y + 7);
            text(doc, String(item.quantity), colX[3] + 3, y + 7);
            text(doc, `£${item.unitPrice.toFixed(2)}`, colX[4] + 3, y + 7);
            text(doc, `${item.vatRate}%`, colX[5] + 3, y + 7);
            text(doc, `£${item.netAmount.toFixed(2)}`, colX[6] + 3, y + 7);
            doc.font('Helvetica-Bold');
            text(doc, `£${item.totalAmount.toFixed(2)}`, colX[7] + 3, y + 7);
            y += rowH;
        });
        y += 8;

        // ── 8. Customs declaration ────────────────────────────────────────
        if (payload.customsDeclaration) {
            const cd = payload.customsDeclaration;
            drawRect(doc, MARGIN, y, CONTENT_W, 14, C.darkMeta);
            doc.fillColor(C.white).font('Helvetica-Bold').fontSize(7.5);
            text(doc, 'CUSTOMS DECLARATION', MARGIN + 8, y + 3);
            y += 16;

            drawRect(doc, MARGIN, y, CONTENT_W, 72, C.surface, C.border);
            const cdFields = [
                ['Origin Country', cd.originCountry],
                ['Destination', cd.destinationCountry],
                ['Declared Value', `£${cd.declaredValue.toFixed(2)}`],
                ['Incoterms', cd.incoterms],
                ['HS Code', cd.hsCode || '—'],
                ['MRN Ref', cd.ukMrnRef || '—'],
                ['Gross Weight', `${cd.grossWeightKg} KG`],
                ['Packages', String(cd.numberOfPackages)],
                ['Dangerous Goods', cd.isDangerousGoods ? 'YES' : 'NO'],
                ['Exporter EORI', cd.exporterEori || '—'],
                ['Goods Description', cd.goodsDescription],
            ];
            const colCdW = (CONTENT_W - 20) / 4;
            cdFields.forEach((f, i) => {
                const col = i % 4;
                const row = Math.floor(i / 4);
                const fx = MARGIN + 10 + col * colCdW;
                const fy = y + 8 + row * 20;
                doc.fillColor(C.muted).font('Helvetica').fontSize(6.5);
                text(doc, f[0].toUpperCase(), fx, fy);
                doc.fillColor(C.text).font('Helvetica-Bold').fontSize(7.5);
                text(doc, f[1], fx, fy + 9, { width: colCdW - 4, lineBreak: false });
            });
            y += 80;
        }

        // ── 9. Totals panel ───────────────────────────────────────────────
        const totalsX = MARGIN + CONTENT_W - 220;
        let ty = y + 8;
        drawRect(doc, totalsX, ty, 220, 130, C.darkBg);

        doc.fillColor(C.muted).font('Helvetica').fontSize(7.5);
        text(doc, 'Subtotal (Net)', totalsX + 10, ty + 12);
        doc.fillColor(C.white).font('Helvetica-Bold').fontSize(7.5);
        text(doc, `£${payload.subtotalNet.toFixed(2)}`, totalsX + 210, ty + 12, { align: 'right', width: 1 });
        // VAT rows
        let vty = ty + 28;
        payload.vatBreakdown.forEach(vb => {
            doc.fillColor(C.muted).font('Helvetica').fontSize(7);
            const label = vb.rate === 12 ? `IPT (${vb.rate}%)` : `VAT (${vb.rate}%)`;
            text(doc, label, totalsX + 10, vty);
            doc.fillColor(C.white).font('Helvetica-Bold').fontSize(7);
            text(doc, `£${vb.vatAmount.toFixed(2)}`, totalsX + 210, vty, { align: 'right', width: 1 });
            vty += 14;
        });

        if (payload.discount && payload.discount > 0) {
            doc.fillColor(C.muted).font('Helvetica').fontSize(7);
            text(doc, 'Discount', totalsX + 10, vty);
            doc.fillColor('#22C55E').font('Helvetica-Bold').fontSize(7);
            text(doc, `-£${payload.discount.toFixed(2)}`, totalsX + 210, vty, { align: 'right', width: 1 });
            vty += 14;
        }

        // Total due
        drawRect(doc, totalsX, ty + 95, 220, 35, C.orange);
        doc.fillColor(C.white).font('Helvetica-Bold').fontSize(9);
        text(doc, 'TOTAL DUE', totalsX + 10, ty + 108);
        doc.font('Helvetica-Bold').fontSize(16);
        text(doc, `£${payload.totalDue.toFixed(2)}`, totalsX + 210, ty + 105, { align: 'right', width: 1 });

        y = ty + 148;

        // ── 10. Payment details ────────────────────────────────────────────
        drawRect(doc, MARGIN, y, CONTENT_W, 14, C.darkMeta);
        doc.fillColor(C.white).font('Helvetica-Bold').fontSize(7.5);
        text(doc, 'PAYMENT DETAILS', MARGIN + 8, y + 3);
        y += 16;

        drawRect(doc, MARGIN, y, CONTENT_W, 46, C.surface, C.border);
        const payFields = [
            ['Bank', payload.bankName],
            ['Sort Code', payload.sortCode],
            ['Account', payload.accountNumber],
            ['IBAN', payload.iban],
            ['BIC/SWIFT', payload.bic],
            ['Reference', payload.paymentReference],
        ];
        const payColW = CONTENT_W / 3;
        payFields.forEach((f, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const px = MARGIN + 10 + col * payColW;
            const py = y + 8 + row * 20;
            doc.fillColor(C.muted).font('Helvetica').fontSize(6.5);
            text(doc, f[0].toUpperCase(), px, py);
            doc.fillColor(C.text).font('Helvetica-Bold').fontSize(8);
            text(doc, f[1], px, py + 9);
        });
        y += 54;

        // ── 11. Insurance certificate ──────────────────────────────────────
        if (payload.insurancePolicy) {
            const ins = payload.insurancePolicy;
            drawRect(doc, MARGIN, y, CONTENT_W, 84, C.blueSoft, '#3B82F6');
            doc.fillColor(C.blue).font('Helvetica-Bold').fontSize(8);
            text(doc, '🛡  CARGO INSURANCE CERTIFICATE', MARGIN + 10, y + 10);
            const insFields = [
                ['Policy No', ins.policyNumber],
                ['Coverage', `£${ins.coverageAmount.toFixed(2)}`],
                ['Clause', ins.iccClause],
                ['Underwriter', ins.underwriter],
                ['Premium Net', `£${ins.premiumNet.toFixed(2)}`],
                ['IPT (12%)', `£${ins.insurancePremiumTax.toFixed(2)}`],
                ['Premium Total', `£${ins.premiumTotal.toFixed(2)}`],
                ['Excess', `£${ins.excess}`],
                ['Valid From', ins.validFrom],
                ['Valid To', ins.validTo],
                ['Claims', ins.claimsEmail],
                ['Claims Deadline', '7 days of discovery'],
            ];
            const insColW = (CONTENT_W - 20) / 4;
            insFields.forEach((f, i) => {
                const col = i % 4;
                const row = Math.floor(i / 4);
                const fx = MARGIN + 10 + col * insColW;
                const fy = y + 26 + row * 20;
                doc.fillColor(C.muted).font('Helvetica').fontSize(6.5);
                text(doc, f[0].toUpperCase(), fx, fy);
                doc.fillColor(C.blue).font('Helvetica-Bold').fontSize(7.5);
                text(doc, f[1], fx, fy + 9, { width: insColW - 4, lineBreak: false });
            });
            y += 92;
        }

        // ── 12. Late payment notice ────────────────────────────────────────
        drawRect(doc, MARGIN, y, CONTENT_W, 36, C.amberSoft, '#F59E0B');
        doc.fillColor(C.amber).font('Helvetica-Bold').fontSize(7);
        text(doc, 'LATE PAYMENT NOTICE', MARGIN + 10, y + 7);
        doc.font('Helvetica').fontSize(6.5);
        text(doc, 'In accordance with the Late Payment of Commercial Debts (Interest) Act 1998, statutory interest of 8% above the Bank of England base rate will be applied to overdue balances. A fixed compensation charge of £70.00 applies to all late payments.', MARGIN + 10, y + 19, { width: CONTENT_W - 20, lineBreak: true });
        y += 44;

        // ── 13. Security footer ────────────────────────────────────────────
        drawRect(doc, 0, y, PAGE_W, 90, C.securityBg);

        // QR code
        doc.image(qrBuffer, MARGIN, y + 8, { width: 72, height: 72 });

        // Hash and URL
        doc.fillColor(C.muted).font('Helvetica').fontSize(6.5);
        text(doc, 'VERIFICATION URL', MARGIN + 82, y + 12);
        doc.fillColor(C.white).font('Courier').fontSize(7);
        text(doc, verifyUrl, MARGIN + 82, y + 22, { width: 260 });

        doc.fillColor(C.muted).font('Helvetica').fontSize(6.5);
        text(doc, 'HMAC-SHA256 SIGNATURE', MARGIN + 82, y + 38);
        doc.fillColor('#94A3B8').font('Courier').fontSize(6);
        text(doc, payload.hmacSignature || '—', MARGIN + 82, y + 48, { width: 280 });

        // Security seals
        const seals = ['SIGNATURE VERIFIED', 'HMAC-SHA256', 'UK GDPR', 'HMRC VAT 700'];
        seals.forEach((seal, i) => {
            const sx = PAGE_W - MARGIN - 4 * 72 + i * 72;
            drawRect(doc, sx + 2, y + 30, 66, 20, '#FFFFFF15');
            doc.fillColor(C.green).font('Helvetica-Bold').fontSize(5.5);
            text(doc, seal, sx + 2, y + 39, { width: 66, align: 'center' });
        });
        y += 94;

        // ── 14. Legal footer ───────────────────────────────────────────────
        drawRect(doc, 0, y, PAGE_W, 50, '#F8FAFC');
        const legalCols = [
            'Dash Delivery Ltd\nRegistered in England & Wales #12345678\nRegistered Office: 123 Logistics Way, London EC1A 1BB',
            'Payment Terms: Net 14 days from issue date\nInterest on late payments per Late Payment Act 1998\nAll prices include applicable taxes where stated',
            'Disputes must be raised within 7 days of issue\nEmail: disputes@dashdelivery.co.uk\nThis document is computer generated and is valid without signature',
        ];
        const legalW = PAGE_W / 3;
        legalCols.forEach((col, i) => {
            doc.fillColor(C.muted).font('Helvetica').fontSize(6);
            doc.text(col, MARGIN + i * legalW, y + 8, { width: legalW - 20, align: 'left', lineBreak: true });
        });

        doc.end();
    });
}

export const uploadInvoicePdf = async (buffer: Buffer, path: string): Promise<string> => {
    const file = adminStorage.bucket().file(path);
    await file.save(buffer, { metadata: { contentType: 'application/pdf' }, public: false });
    const [url] = await file.getSignedUrl({ action: 'read', expires: '2099-01-01' });
    return url;
};
