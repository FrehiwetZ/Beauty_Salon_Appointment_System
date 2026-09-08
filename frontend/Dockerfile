# =============================================================
# Dockerfile - Beauty Salon Frontend
# =============================================================
# Multi-stage build for the React/Vite frontend application.
# Stage 1: Build the production bundle.
# Stage 2: Serve via lightweight nginx.
# =============================================================

# --------------- Stage 1: Build ---------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# --------------- Stage 2: Serve with Nginx ---------------
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose frontend port
EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
