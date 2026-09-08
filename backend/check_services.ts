/**
 * =============================================================
 * Check Services Script
 * =============================================================
 * Quick diagnostic script to verify service records exist in
 * the database and inspect the raw structure of the first
 * service entry.
 *
 * Usage: npx tsx check_services.ts
 * =============================================================
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const services = await prisma.service.findMany();
  console.log('SERVICES COUNT:', services.length);
  console.log('FIRST SERVICE RAW:', services[0]);
}

main().catch(console.error).finally(() => prisma.$disconnect());
