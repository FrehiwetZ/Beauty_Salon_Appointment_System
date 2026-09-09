/**
 * Environment Configuration
 * Validates and exports typed environment variables using Zod.
 * The application will exit if required variables are missing.
 */

import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Schema defining all required and optional environment variables.
 * Each variable is validated at startup to prevent runtime errors.
 */
const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  ADMIN_USERNAME: z.string().default('admin'),
  ADMIN_PASSWORD: z.string().default('Admin@12345'),
});

/** Parse and validate environment variables */
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Invalid environment variables:', _env.error.format());
  process.exit(1);
}

/** Validated and typed environment variables */
export const env = _env.data;
