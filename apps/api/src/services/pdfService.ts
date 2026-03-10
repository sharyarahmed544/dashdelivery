import PDFDocument from 'pdfkit';
import { adminStorage } from '../lib/firebase';

export const generateInvoicePDF = (invoiceData: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.fillColor('#FF4500').font('Helvetica-Bold').fontSize(20).text('DASH DELIVERY', 50, 50);
    doc.fillColor('#444444').fontSize(10).text('INVOICE', 0, 50, { align: 'right' });
    
    doc.moveDown();
    doc.fillColor('#000000').fontSize(12).text(`Invoice Number: ${invoiceData.invoice_number}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    
    doc.moveDown();
    doc.text('Bill To:', { underline: true });
    doc.text(invoiceData.customer_name);
    doc.text(invoiceData.customer_address);

    // Table Header
    doc.moveDown();
    const tableTop = 250;
    doc.font('Helvetica-Bold').text('Description', 50, tableTop);
    doc.text('Amount', 0, tableTop, { align: 'right' });

    // Line items (simplified)
    const items = invoiceData.line_items;
    let y = tableTop + 25;
    doc.font('Helvetica').fontSize(10);
    items.forEach((item: any) => {
      doc.text(item.description, 50, y);
      doc.text(`£${item.amount.toFixed(2)}`, 0, y, { align: 'right' });
      y += 20;
    });

    // Summary
    doc.moveDown();
    doc.font('Helvetica-Bold').fontSize(12).text(`Total: £${invoiceData.total.toFixed(2)}`, 0, y + 20, { align: 'right' });

    doc.end();
  });
};

export const uploadToStorage = async (buffer: Buffer, destination: string): Promise<string> => {
  const file = adminStorage.bucket().file(destination);
  await file.save(buffer, {
    metadata: { contentType: 'application/pdf' },
    public: true
  });
  
  // Return public URL (assuming bucket is public or we use signed URL)
  // For simplicity, using the public standard URL pattern
  return `https://storage.googleapis.com/${adminStorage.bucket().name}/${destination}`;
};
