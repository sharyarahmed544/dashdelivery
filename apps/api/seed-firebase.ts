import * as dotenv from 'dotenv';
dotenv.config();
import { adminDb } from './src/lib/firebase';

const seedData = async () => {
  console.log('🌱 Seeding Firebase...');

  // 1. Content Blocks
  const contentBlocks = [
    {
      key: 'hero_home',
      title: 'Fast & Reliable Global Delivery',
      body: 'Get your parcels delivered across the world with our state-of-the-art logistics network.',
      cta_text: 'Book a Pickup',
      cta_url: '/book',
      is_active: true
    },
    {
      key: 'about_preview',
      title: 'Our Mission',
      body: 'To provide the world with the most efficient and transparent delivery service.',
      cta_text: 'Read More',
      cta_url: '/about',
      is_active: true
    }
  ];

  for (const block of contentBlocks) {
    await adminDb.collection('contentBlocks').doc(block.key).set({
      ...block,
      updated_at: new Date().toISOString()
    });
  }

  // 2. Services
  const services = [
    {
      name: 'Standard Delivery',
      description: 'Reliable 3-5 day delivery for non-urgent shipments.',
      base_price: 15.0,
      sort_order: 1,
      is_active: true
    },
    {
      name: 'Express Delivery',
      description: 'Next-day delivery for urgent parcels.',
      base_price: 35.0,
      sort_order: 2,
      is_active: true
    },
    {
      name: 'International Shipping',
      description: 'Global reach with expert customs handling.',
      base_price: 50.0,
      sort_order: 3,
      is_active: true
    }
  ];

  for (const service of services) {
    await adminDb.collection('services').add({
      ...service,
      updated_at: new Date().toISOString()
    });
  }

  // 3. Site Settings
  const settings = [
    { id: 'site_name', value: 'Dash Delivery' },
    { id: 'contact_email', value: 'support@dashdelivery.co.uk' },
    { id: 'maintenance_mode', value: 'false' }
  ];

  for (const setting of settings) {
    await adminDb.collection('siteSettings').doc(setting.id).set({
      ...setting,
      updated_at: new Date().toISOString()
    });
  }

  // 4. Price Rules (Aligned with Frontend Defaults)
  const priceRules = [
    {
      from_country: 'United Kingdom',
      to_country: 'Germany',
      service_type: 'STANDARD',
      base_price: 15.0,
      per_kg_price: 2.5,
      fuel_levy_pct: 5,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      from_country: 'United Kingdom',
      to_country: 'France',
      service_type: 'EXPRESS',
      base_price: 35.0,
      per_kg_price: 4.0,
      fuel_levy_pct: 8,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      from_country: 'Italy',
      to_country: 'Spain',
      service_type: 'STANDARD',
      base_price: 18.0,
      per_kg_price: 3.0,
      fuel_levy_pct: 6,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  for (const rule of priceRules) {
    await adminDb.collection('priceRules').add(rule);
  }

  console.log('✅ Seeding complete!');
};

seedData().catch(console.error);
