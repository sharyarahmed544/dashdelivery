import nodemailer from 'nodemailer';
import { adminDb } from '../lib/firebase';

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
    console.error('Email send failed:', error);
    return false;
  }
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
