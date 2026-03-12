import nodemailer from 'nodemailer';
import { adminDb } from '../lib/firebase';
import logger from '../lib/logger';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async (to: string, subject: string, html: string, attachments?: any[]) => {
  try {
    await transporter.sendMail({
      from: `"Dash Delivery" <${process.env.EMAIL_USER === 'apikey' ? 'noreply@dashdelivery.co.uk' : process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments
    });
    return true;
  } catch (error) {
    logger.error('Email/Transactional Error:', error);
    return false;
  }
};

export interface InvoiceEmailParams {
  to: string;
  customerName: string;
  invoiceNumber: string;
  totalDue: number;
  currency: string;
  dueDate: string;
  pdfBuffer: Buffer;
  trackingNumber?: string;
  verifyUrl: string;
}

export const sendInvoiceEmail = async (params: InvoiceEmailParams): Promise<boolean> => {
  const { to, customerName, invoiceNumber, totalDue, currency, dueDate, pdfBuffer, trackingNumber, verifyUrl } = params;
  const subject = `Invoice ${invoiceNumber} — Dash Delivery`;
  const formattedDue = new Date(dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const formattedTotal = `${currency} ${totalDue.toFixed(2)}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#0A0D14;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0D14;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#12161F;border-radius:12px;overflow:hidden;border:1px solid #1E2433;">
        <!-- Orange accent strip -->
        <tr><td style="background:#FF5C35;height:4px;font-size:0;">&nbsp;</td></tr>
        <!-- Header -->
        <tr><td style="padding:32px 40px;background:#0A0D14;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <span style="display:inline-block;background:#FF5C35;color:#fff;font-weight:900;font-size:20px;padding:6px 12px;border-radius:6px;letter-spacing:2px;">DD</span>
                <span style="color:#fff;font-size:20px;font-weight:700;margin-left:10px;vertical-align:middle;">DashDelivery</span>
              </td>
              <td align="right">
                <span style="background:#FF5C3520;color:#FF5C35;font-size:11px;font-weight:700;letter-spacing:3px;padding:6px 14px;border:1px solid #FF5C3540;border-radius:6px;text-transform:uppercase;">TAX INVOICE</span>
              </td>
            </tr>
          </table>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px 40px;">
          <p style="color:#94A3B8;font-size:14px;margin:0 0 8px;">Hello ${customerName},</p>
          <p style="color:#F1F5F9;font-size:16px;margin:0 0 32px;">Please find your invoice attached to this email.</p>
          <!-- Invoice details box -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#1E2433;border-radius:8px;margin-bottom:32px;">
            <tr>
              <td style="padding:20px 24px;border-bottom:1px solid #2D3748;">
                <span style="color:#64748B;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Invoice Number</span><br>
                <span style="color:#FF5C35;font-size:18px;font-weight:700;font-family:monospace;">${invoiceNumber}</span>
              </td>
              <td style="padding:20px 24px;border-bottom:1px solid #2D3748;">
                <span style="color:#64748B;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Amount Due</span><br>
                <span style="color:#F1F5F9;font-size:18px;font-weight:700;">${formattedTotal}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px;">
                <span style="color:#64748B;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Due Date</span><br>
                <span style="color:#F1F5F9;font-size:14px;font-weight:600;">${formattedDue}</span>
              </td>
              ${trackingNumber ? `<td style="padding:20px 24px;">
                <span style="color:#64748B;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Tracking Number</span><br>
                <span style="color:#F1F5F9;font-size:14px;font-weight:600;font-family:monospace;">${trackingNumber}</span>
              </td>` : '<td></td>'}
            </tr>
          </table>
          <p style="color:#64748B;font-size:12px;margin:0 0 16px;">
            You can verify the authenticity of this invoice at:<br>
            <a href="${verifyUrl}" style="color:#FF5C35;text-decoration:none;">${verifyUrl}</a>
          </p>
          <p style="color:#64748B;font-size:12px;margin:0;">Please include the invoice number as your payment reference. For queries, contact <a href="mailto:accounts@dashdelivery.co.uk" style="color:#FF5C35;">accounts@dashdelivery.co.uk</a></p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:24px 40px;background:#0A0D14;border-top:1px solid #1E2433;">
          <p style="color:#475569;font-size:11px;margin:0;text-align:center;">Dash Delivery Ltd · Registered in England & Wales · VAT Reg: GB123456789<br>
          This invoice was digitally signed with HMAC-SHA256 per HMRC VAT Notice 700.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return sendEmail(to, subject, html, [
    {
      filename: `${invoiceNumber}.pdf`,
      content: pdfBuffer.toString('base64'),
      encoding: 'base64',
      contentType: 'application/pdf',
    },
  ]);
};

export const sendTransactionalEmail = async (templateKey: string, to: string, variables: any, attachments?: any[]) => {
  try {
    const snapshot = await adminDb.collection('emailTemplates').where('key', '==', templateKey).limit(1).get();

    if (snapshot.empty) {
      console.error(`Email template ${templateKey} not found`);
      return false;
    }

    const template = snapshot.docs[0].data();
    let html = template.html_body;
    let subject = template.subject;

    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, variables[key]);
      subject = subject.replace(regex, variables[key]);
    });

    return sendEmail(to, subject, html, attachments);
  } catch (error) {
    console.error('Transactional Email Error:', error);
    return false;
  }
};
