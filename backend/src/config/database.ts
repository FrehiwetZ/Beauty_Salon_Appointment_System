/**
 * Database Configuration
 * Initializes and exports a singleton Prisma Client instance
 * for database access throughout the application.
 */

import { PrismaClient } from '@prisma/client';

/** Singleton Prisma Client instance */
export const prisma = new PrismaClient();
