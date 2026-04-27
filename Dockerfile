# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY Frontend/package*.json ./
RUN npm install
COPY Frontend/ ./
# Build frontend (output goes to /app/frontend/dist)
RUN npm run build

# Stage 2: Final Image (Backend + Serving Frontend)
FROM node:18-alpine
WORKDIR /app/backend

# Copy backend package files and install dependencies
COPY Backend/package*.json ./
RUN npm install --production

# Copy backend source code
COPY Backend/ ./

# Copy built frontend from Stage 1
COPY --from=frontend-builder /app/frontend/dist /app/Frontend/dist

# Set production environment
ENV NODE_ENV=production
ENV PORT=10000

# Expose the port Render expects (default is 10000 or use $PORT)
EXPOSE 10000

# Start the server
CMD ["node", "server.js"]
