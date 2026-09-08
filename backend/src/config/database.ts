import { PrismaClient } from '@prisma/client';

/**
 * prisma
 *
 * Singleton Prisma client instance shared across the application.
 * Import this wherever database access is needed instead of
 * creating a new PrismaClient per module.
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client
 */
export const prisma = new PrismaClient();
