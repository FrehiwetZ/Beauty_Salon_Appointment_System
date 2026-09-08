import { z } from 'zod';
import dotenv from 'dotenv';

/**
 * env.ts
 *
 * Loads and validates environment variables at startup using Zod.
 * The application exits immediately if required variables are missing
 * or invalid, preventing silent misconfiguration in any environment.
 */
dotenv.config();

// Define the shape and constraints of all required environment variables
const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  ADMIN_USERNAME: z.string().default('admin'),
  ADMIN_PASSWORD: z.string().default('Admin@12345'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
