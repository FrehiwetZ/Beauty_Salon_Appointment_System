/**
 * =============================================================
 * Check Data Script
 * =============================================================
 * Diagnostic script that queries and logs all Services, Staff
 * Profiles, and Posts from the database. Useful for verifying
 * seed data and debugging database content.
 *
 * Usage: npx tsx check_data.ts
 * =============================================================
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const services = await prisma.service.findMany();
  console.log('SERVICES COUNT:', services.length);
  console.log('SERVICES:', JSON.stringify(services, null, 2));
  const staff = await prisma.staffProfile.findMany({ include: { user: true } });
  console.log('STAFF COUNT:', staff.length);
  console.log('STAFF:', JSON.stringify(staff, null, 2));
  const posts = await prisma.post.findMany();
  console.log('POSTS COUNT:', posts.length);
  console.log('POSTS:', JSON.stringify(posts, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
