# =============================================================
# Docker Deployment Guide - Beauty Salon Appointment System
# =============================================================

## Prerequisites

- Docker Engine 20.10+
- Docker Compose v2.0+

## Quick Start

### 1. Clone and configure environment

```bash
git clone <repository-url>
cd Beauty_Salon_Appointment_System
```

### 2. Create environment file

Create a `.env` file in the project root:

```env
# Database Configuration
DB_USER=salon_user
DB_PASSWORD=salon_pass
DB_NAME=beauty_salon
DB_PORT=5432

# Backend Configuration
JWT_SECRET=your_super_secret_jwt_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@12345

# Frontend Configuration
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Build and start all services

```bash
# Build and start in detached mode
docker compose up -d --build

# View logs
docker compose logs -f

# View logs for a specific service
docker compose logs -f backend
```

### 4. Run database migrations and seed

```bash
# Run Prisma migrations inside the backend container
docker compose exec backend npx prisma migrate deploy

# Seed the database
docker compose exec backend npx prisma db seed
```

### 5. Access the application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/v1
- **Database:** localhost:5432

## Common Docker Commands

```bash
# Stop all services
docker compose down

# Stop and remove volumes (reset database)
docker compose down -v

# Rebuild a specific service
docker compose build backend

# Restart a specific service
docker compose restart frontend

# Open a shell in a running container
docker compose exec backend sh

# Check service status
docker compose ps
```

## Production Deployment Notes

- Change all default passwords in the `.env` file
- Set `NODE_ENV=production` for the backend
- Use a managed PostgreSQL service (e.g., Neon, AWS RDS)
- Configure proper SSL/TLS certificates
- Set up a reverse proxy (nginx) for HTTPS
