import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.post.deleteMany();
  console.log('Posts deleted successfully.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
