/**
 * Database Configuration
 * Initializes and exports a singleton Prisma Client instance
 * for database access throughout the application.
 */

import { PrismaClient } from '@prisma/client';

<<<<<<< HEAD
/**
 * prisma
 *
 * Singleton Prisma client instance shared across the application.
 * Import this wherever database access is needed instead of
 * creating a new PrismaClient per module.
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client
 */
=======
/** Singleton Prisma Client instance */
>>>>>>> 0f26774 (update backend configuration and middleware)
export const prisma = new PrismaClient();
// Note: Prisma connects lazily — the actual DB connection is made on first query
