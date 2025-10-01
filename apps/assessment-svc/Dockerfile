# Use the main Dockerfile from root with service-specific build arg
ARG SERVICE_NAME=assessment-svc
FROM node:18-alpine AS builder

WORKDIR /app
COPY . .
RUN npm ci
RUN cd packages/prisma && npx prisma generate
RUN npm run build --workspace=apps/assessment-svc

FROM node:18-alpine AS production
RUN apk add --no-cache dumb-init curl
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/packages ./packages
COPY --from=builder --chown=nodejs:nodejs /app/apps/assessment-svc/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/apps/assessment-svc/package.json ./package.json

USER nodejs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD curl -f http://localhost:3000/health || exit 1
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
