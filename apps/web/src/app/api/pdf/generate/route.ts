import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import sgMail from '@sendgrid/mail';
import { adminStorage } from '@/lib/firebase/admin';
import { v4 as uuidv4 } from 'uuid';

// Initialize SendGrid if API key exists
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(req: Request) {
  try {
    const { email, amount, trackingId } = await req.json();

    // 1. Generate PDF in memory
    const doc = new PDFDocument();
    let buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    
    // Generate PDF Content
    doc.fontSize(25).text('Dash Delivery Invoice', 100, 100);
    doc.fontSize(15).text(`Tracking ID: ${trackingId}`, 100, 150);
    doc.text(`Total Amount: £${amount.toFixed(2)}`, 100, 180);
    doc.text(`Billed to: ${email}`, 100, 210);
    doc.end();

    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
    });

    // 2. Upload to Firebase Storage
    const fileName = `invoices/${trackingId}-${uuidv4()}.pdf`;
    let fileUrl = 'https://example.com/mock-invoice.pdf'; // Fallback
    
    if (adminStorage) {
      try {
        const bucket = adminStorage.bucket();
        const file = bucket.file(fileName);
        await file.save(pdfBuffer, {
          contentType: 'application/pdf',
          public: true,
        });
        fileUrl = file.publicUrl();
      } catch (err) {
        console.warn("Firebase storage error, using fallback URL.", err);
      }
    }

    // 3. Send Email using SendGrid
    if (process.env.SENDGRID_API_KEY) {
      try {
        const msg = {
          to: email,
          from: 'billing@dash-delivery.com', // MUST be verified in SendGrid
          subject: `Your Invoice from Dash Delivery (${trackingId})`,
          text: `Thank you for your business. You can view your invoice here: ${fileUrl}`,
          html: `<strong>Thank you for your business.</strong><br> You can view your invoice here: <a href="${fileUrl}">${fileUrl}</a>`,
        };
        await sgMail.send(msg);
      } catch (err) {
        console.warn("SendGrid email error", err);
      }
    }

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error: any) {
    console.error("PDF/Email Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
