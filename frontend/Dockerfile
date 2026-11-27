# ==========================================
# CampaignOS Frontend Dockerfile (Vite + Nginx)
# ==========================================

# ------------------------------------------
# Stage 1: Build the React SPA
# ------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies with clean cache
COPY package.json package-lock.json ./
RUN npm ci

# Copy source files
COPY . .

# Build production bundle to /app/dist
RUN npm run build

# ------------------------------------------
# Stage 2: Serve with Production Nginx
# ------------------------------------------
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose standard HTTP port
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget -q -O /dev/null http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
