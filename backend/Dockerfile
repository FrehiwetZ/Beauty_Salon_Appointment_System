# =============================================================
# Dockerfile - Beauty Salon Backend
# =============================================================
# Multi-stage build for the Node.js/Express/Prisma backend.
# Stage 1: Install dependencies and generate Prisma client.
# Stage 2: Production-ready image with minimal footprint.
# =============================================================

# --------------- Stage 1: Build ---------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code and build
COPY . .
RUN npm run build

# --------------- Stage 2: Production ---------------
FROM node:20-alpine AS production

WORKDIR /app

# Copy only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy generated Prisma client and build output
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expose backend port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/v1/health || exit 1

# Start the application
CMD ["node", "dist/server.js"]
