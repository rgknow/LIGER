# Multi-stage Node.js Dockerfile for LIGER services
FROM node:18-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/prisma/package.json ./packages/prisma/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma client
RUN cd packages/prisma && npx prisma generate

# Build the application
ARG SERVICE_NAME
RUN npm run build --workspace=apps/${SERVICE_NAME}

# Production stage
FROM node:18-alpine AS production

RUN apk add --no-cache dumb-init curl

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/packages ./packages

ARG SERVICE_NAME
COPY --from=builder --chown=nodejs:nodejs /app/apps/${SERVICE_NAME}/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/apps/${SERVICE_NAME}/package.json ./package.json

USER nodejs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]