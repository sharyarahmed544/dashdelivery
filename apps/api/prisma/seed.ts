import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data...');

  // 1. Initial Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dashdelivery.co.uk' },
    update: {},
    create: {
      email: 'admin@dashdelivery.co.uk',
      name: 'Super Admin',
      password_hash: '$2b$10$YourHashedPasswordHere', // Needs real hash via bcrypt
      role: 'ADMIN',
    },
  });

  // 2. Services
  const services = [
    { slug: 'same-day', name: 'Same-Day Express', description: 'Order before 10am, delivered before 6pm.', icon: '⚡', price_from: 8.99, duration: '6-8 Hours' },
    { slug: 'eu-express', name: 'European Express', description: 'Door-to-door across 28 EU countries.', icon: '🌍', price_from: 25.00, duration: '2-3 Days' },
    { slug: 'pallet', name: 'Pallet & Freight', description: 'B2B freight across UK and Europe.', icon: '📦', price_from: 45.00, duration: 'Timed Delivery' },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }

  // 3. Testimonials
  const testimonials = [
    { author_name: 'Sarah Johnson', author_role: 'Ops Director', company: 'Bloom & Co', quote: 'Switched 8 months ago — deliveries that took 3 days now arrive next day.', rating: 5, is_published: true },
    { author_name: 'Marcus Taylor', author_role: 'CTO', company: 'TradeFlow UK', quote: 'The API integration took our dev 90 minutes. Now 100% automated.', rating: 5, is_published: true },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  // 4. Content Blocks
  const blocks = [
    { key: 'hero-title', title: 'FAST, RELIABLE', body: 'LOGISTICS REDEFINED' },
    { key: 'hero-sub', body: 'The UK\'s most advanced parcel network. Real-time GPS, AI-driven routing, and carbon-neutral delivery as standard.' },
  ];

  for (const b of blocks) {
    await prisma.contentBlock.upsert({
      where: { key: b.key },
      update: b,
      create: b,
    });
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
