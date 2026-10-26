# Multi-stage production Dockerfile for Next.js 14 Standalone Output
# Operating base: node:20-alpine
FROM node:20-alpine AS base

# 1. Dependency Stage
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# 2. Builder Stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV DOCKER_BUILD=1

# Provide dummy build-time environment defaults to permit static analysis
ENV NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-anon-key

RUN npm run build

# 3. Production Runner Stage
FROM base AS runner
WORKDIR /app

LABEL org.opencontainers.image.title="HomaceBuild and Realators"
LABEL org.opencontainers.image.description="Production Next.js application container"
LABEL org.opencontainers.image.vendor="HomaceBuild and Realators"

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install curl/wget for health monitoring in alpine
RUN apk add --no-cache wget

# Create non-root system user for least privilege security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static assets and standalone server artifacts
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Automated healthcheck checking internal health probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
