import { Router } from 'express';
import { getContentBlocks, updateContentBlock, getSiteSettings, updateSiteSetting } from '../controllers/cms';
import { getPriceRules, upsertPriceRule } from '../controllers/settings';
import { getBookings, updateBookingStatus, createBooking } from '../controllers/bookings';
import {
    generateInvoice,
    getInvoices,
    getInvoice,
    sendInvoice,
    markPaid,
    voidInvoice,
    getVatReport,
    downloadInvoicePdf,
} from '../controllers/invoices';
import { getQuotes, updateQuote } from '../controllers/quotes';
import { getDashboardStats } from '../controllers/dashboard';
import { getUsers } from '../controllers/users';
import { authenticateJWT, authorizeRole } from '../middleware/auth';

const router = Router();

// Apply auth to all admin routes
router.use(authenticateJWT);
router.use(authorizeRole(['ADMIN', 'SUPER_ADMIN']));

// Dashboard
router.get('/dashboard', getDashboardStats);

// CMS
router.get('/content', getContentBlocks);
router.put('/content/:id', updateContentBlock);
router.get('/settings', getSiteSettings);
router.put('/settings/:key', updateSiteSetting);

// Pricing
router.get('/pricing', getPriceRules);
router.post('/pricing', upsertPriceRule);

// Bookings
router.get('/bookings', getBookings);
router.post('/bookings', createBooking);
router.put('/bookings/:id/status', updateBookingStatus);

// Invoices — specific routes before parameterised ones
router.post('/invoices/generate', generateInvoice);
router.get('/invoices/vat-report', getVatReport);
router.get('/invoices', getInvoices);
router.get('/invoices/:invoiceNumber', getInvoice);
router.post('/invoices/:invoiceNumber/send', sendInvoice);
router.post('/invoices/:invoiceNumber/mark-paid', markPaid);
router.post('/invoices/:invoiceNumber/void', voidInvoice);
router.get('/invoices/:invoiceNumber/pdf', downloadInvoicePdf);

// Quotes
router.get('/quotes', getQuotes);
router.put('/quotes/:id', updateQuote);

// Users
router.get('/users', getUsers);

export default router;
