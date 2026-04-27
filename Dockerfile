# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
# Copy only package files first for better caching
COPY Frontend/package*.json ./
RUN npm ci
# Copy source and build
COPY Frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
# Install build dependencies for native modules (like bcrypt)
RUN apk add --no-cache python3 make g++
# Copy only package files first
COPY Backend/package*.json ./
RUN npm ci --omit=dev
# Copy backend source
COPY Backend/ ./

# Stage 3: Final Production Image
FROM node:20-alpine
WORKDIR /app/backend

# Create uploads directory with correct permissions for the non-root user
RUN mkdir -p uploads && chown -R node:node /app

# Copy production dependencies and source from backend-builder
COPY --from=backend-builder --chown=node:node /app/backend ./

# Copy built frontend assets to the expected path (../Frontend/dist relative to /app/backend)
COPY --from=frontend-builder --chown=node:node /app/frontend/dist /app/Frontend/dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=10000

# Expose production port
EXPOSE 10000

# Use non-root user for security
USER node

# Health check to ensure the server is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:10000/api/health || exit 1

# Launch the application
CMD ["node", "server.js"]
