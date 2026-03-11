import { z } from 'zod';

// Shared components
const EmailSchema = z.string().email('Invalid email format').max(255).toLowerCase();

export const BookingSchema = z.object({
    pickup_address: z.string().min(5),
    delivery_address: z.string().min(5),
    service_type: z.enum(['STANDARD', 'EXPRESS', 'SAME_DAY']),
    weight: z.number().positive(),
    dimensions: z.string().optional(),
    estimated_price: z.number().nonnegative(),
    notes: z.string().optional(),
    customer_name: z.string().min(2),
    email: EmailSchema,
});

export const UpdateBookingStatusSchema = z.object({
    status: z.string().min(1),
    location: z.string().min(1),
    description: z.string().optional(),
});

export const QuoteSchema = z.object({
    company_name: z.string().optional(),
    contact_name: z.string().min(2),
    email: EmailSchema,
    phone: z.string().min(10),
    from_country: z.string().min(2),
    to_country: z.string().min(2),
    service_type: z.string().min(1),
    weight: z.number().positive(),
    cargo_description: z.string().min(5),
    message: z.string().optional(),
});

export const UpdateQuoteSchema = z.object({
    status: z.string().min(1),
    price_offered: z.number().nonnegative().optional(),
});

export const PricingSchema = z.object({
    from_country: z.string().min(2),
    to_country: z.string().min(2),
    service_type: z.string().min(1),
    weight: z.number().positive(),
});

export const ContentBlockSchema = z.object({
    title: z.string().min(1),
    body: z.string().min(1),
    cta_text: z.string().optional(),
    cta_url: z.string().optional(),
    is_active: z.boolean().optional(),
});

export const SiteSettingSchema = z.object({
    value: z.any(),
});

export const PriceRuleSchema = z.object({
    id: z.string().optional(),
    from_country: z.string().min(2),
    to_country: z.string().min(2),
    service_type: z.string().min(1),
    base_price: z.union([z.number(), z.string()]).transform(v => Number(v)),
    per_kg_price: z.union([z.number(), z.string()]).transform(v => Number(v)),
    fuel_levy_pct: z.union([z.number(), z.string()]).transform(v => Number(v)),
    is_active: z.boolean(),
});
