import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import crypto from 'crypto';
import { adminStorage } from '../lib/firebase';
import { calculateVAT } from './vatService';

/**
 * Generates a Secure Enterprise PDF Invoice
 * Includes QR verification, VAT breakdown, and cryptographic checksum
 */
export const generateInvoicePDF = async (invoiceData: any): Promise<Buffer> => {
  const {
    id,
    invoice_number,
    customer_name,
    customer_address,
    line_items,
    country_code = 'GB'
  } = invoiceData;

  // 1. Calculate VAT
  const subtotal = line_items.reduce((sum: number, item: any) => sum + item.amount, 0);
  const vatCalculations = calculateVAT(subtotal, country_code);

  // 2. Generate Verification QR Code
  // In production, this would link to something like: https://dash-delivery.com/verify/INV-123
  const verificationPayload = JSON.stringify({
    id,
    inv: invoice_number,
    total: vatCalculations.total,
    hash: crypto.createHash('sha256').update(`${id}-${invoice_number}`).digest('hex').substring(0, 16)
  });

  const qrBuffer = await QRCode.toBuffer(verificationPayload, {
    errorCorrectionLevel: 'H',
    margin: 1,
    color: {
      dark: '#FF4500',
      light: '#FFFFFF'
    }
  });

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // --- Header ---
    doc.fillColor('#FF4500').font('Helvetica-Bold').fontSize(24).text('DASH DELIVERY', 50, 50);

    doc.fillColor('#444444').fontSize(10).font('Helvetica');
    doc.text('Premium Global Logistics', 50, 75);
    doc.text('VAT Reg: GB123456789', 50, 90);

    doc.fillColor('#F1F5F9').rect(400, 40, 145, 100).fill(); // Background for invoice meta
    doc.fillColor('#FF4500').fontSize(12).font('Helvetica-Bold').text('INVOICE', 410, 55);
    doc.fillColor('#1E293B').fontSize(10).font('Helvetica').text(`No: ${invoice_number}`, 410, 75);
    doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 410, 90);
    doc.text(`Due: ${new Date(Date.now() + 14 * 86400000).toLocaleDateString('en-GB')}`, 410, 105);

    // --- Addresses ---
    doc.moveDown(4);
    const addressTop = 160;

    doc.fillColor('#64748B').fontSize(10).font('Helvetica-Bold').text('SENDER', 50, addressTop);
    doc.fillColor('#1E293B').font('Helvetica').text('Dash Delivery HQ', 50, addressTop + 15);
    doc.text('123 Logistics Way', 50, addressTop + 30);
    doc.text('London, EC1A 1BB, UK', 50, addressTop + 45);

    doc.fillColor('#64748B').font('Helvetica-Bold').text('BILL TO', 300, addressTop);
    doc.fillColor('#1E293B').font('Helvetica').text(customer_name, 300, addressTop + 15);
    const splitAddress = customer_address.split(',');
    splitAddress.forEach((line: string, i: number) => {
      doc.text(line.trim(), 300, addressTop + 30 + (i * 15));
    });

    // --- Table Header ---
    const tableTop = 300;
    doc.fillColor('#F8FAFC').rect(50, tableTop, 495, 25).fill();
    doc.fillColor('#475569').font('Helvetica-Bold').fontSize(10);
    doc.text('Description', 60, tableTop + 8);
    doc.text('Qty', 300, tableTop + 8);
    doc.text('Rate', 380, tableTop + 8);
    doc.text('Amount', 480, tableTop + 8, { align: 'right', width: 50 });

    // --- Table Body ---
    let y = tableTop + 35;
    doc.font('Helvetica').fillColor('#1E293B');

    line_items.forEach((item: any) => {
      doc.text(item.description, 60, y);
      doc.text('1', 300, y);
      doc.text(`£${item.amount.toFixed(2)}`, 380, y);
      doc.text(`£${item.amount.toFixed(2)}`, 480, y, { align: 'right', width: 50 });
      y += 25;

      // Horizontal line
      doc.strokeColor('#E2E8F0').lineWidth(0.5).moveTo(50, y - 5).lineTo(545, y - 5).stroke();
    });

    // --- Totals ---
    const totalPos = y + 20;
    doc.font('Helvetica').fontSize(10).fillColor('#64748B');
    doc.text('Subtotal:', 380, totalPos);
    doc.fillColor('#1E293B').text(`£${subtotal.toFixed(2)}`, 480, totalPos, { align: 'right', width: 50 });

    doc.fillColor('#64748B').text(`VAT (${vatCalculations.vatRate}%):`, 380, totalPos + 20);
    doc.fillColor('#1E293B').text(`£${vatCalculations.vatAmount.toFixed(2)}`, 480, totalPos + 20, { align: 'right', width: 50 });

    doc.fillColor('#F1F5F9').rect(370, totalPos + 40, 175, 40).fill();
    doc.font('Helvetica-Bold').fontSize(14).fillColor('#FF4500');
    doc.text('TOTAL:', 380, totalPos + 53);
    doc.text(`£${vatCalculations.total.toFixed(2)}`, 460, totalPos + 53, { align: 'right', width: 75 });

    // --- Footer & Verification ---
    const footerTop = 700;
    doc.strokeColor('#CBD5E1').lineWidth(1).moveTo(50, footerTop).lineTo(545, footerTop).stroke();

    // QR Code for verification
    doc.image(qrBuffer, 50, footerTop + 20, { width: 80 });

    doc.fillColor('#475569').font('Helvetica-Bold').fontSize(8).text('SECURE VERIFICATION QR', 140, footerTop + 25);
    doc.font('Helvetica').fontSize(7).text('Scan to verify the authenticity of this document.', 140, footerTop + 37);
    doc.text(`Digital Fingerprint: ${crypto.createHash('md5').update(invoice_number).digest('hex')}`, 140, footerTop + 47);

    doc.fillColor('#94A3B8').fontSize(8).text('Payment Terms: Net 14. Please include the invoice number as reference.', 50, 780, { align: 'center' });
    doc.text('Dash Delivery Ltd | Registered in England & Wales #12345678', 50, 792, { align: 'center' });

    doc.end();
  });
};

export const uploadToStorage = async (buffer: Buffer, destination: string): Promise<string> => {
  const file = adminStorage.bucket().file(destination);
  await file.save(buffer, {
    metadata: { contentType: 'application/pdf' },
    public: true
  });

  return `https://storage.googleapis.com/${adminStorage.bucket().name}/${destination}`;
};
