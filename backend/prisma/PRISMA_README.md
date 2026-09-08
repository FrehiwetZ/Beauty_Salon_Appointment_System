# =============================================================
# Prisma Database Guide - Beauty Salon Appointment System
# =============================================================
#
# This document provides a quick reference for common Prisma
# commands used during development and deployment.
#
# =============================================================

## Common Prisma Commands

### Development Workflow

```bash
# Push schema changes directly to the database (dev only)
npx prisma db push

# Generate/regenerate the Prisma Client after schema changes
npx prisma generate

# Seed the database with initial data
npx prisma db seed

# Open Prisma Studio (visual database browser)
npx prisma studio
```

### Migration Workflow (Production)

```bash
# Create a new migration from schema changes
npx prisma migrate dev --name <migration_name>

# Apply pending migrations in production
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Reset the database (WARNING: destroys all data)
npx prisma migrate reset
```

### Introspection & Formatting

```bash
# Pull the current database schema into schema.prisma
npx prisma db pull

# Format the Prisma schema file
npx prisma format

# Validate the Prisma schema
npx prisma validate
```

## Schema Overview

The Beauty Salon system uses the following models:

| Model           | Purpose                                    |
|-----------------|--------------------------------------------|
| User            | Customer, Staff, and Admin accounts         |
| StaffProfile    | Extended profile for staff members          |
| Service         | Salon services (haircut, facial, etc.)      |
| StaffService    | Many-to-many: which staff offer which services |
| WorkingHour     | Staff availability per day of week          |
| BlockedPeriod   | Staff time-off / blocked slots              |
| Appointment     | Booking records with status tracking        |
| Rating          | Customer reviews for completed appointments |
| Post            | News and announcements                      |
| Notification    | In-app notifications for users              |
| SiteSetting     | Global salon configuration                  |

## Environment Variables

The database connection is configured via the `DATABASE_URL` environment variable
in the `.env` file:

```
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```
