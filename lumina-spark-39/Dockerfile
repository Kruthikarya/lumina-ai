# syntax=docker/dockerfile:1.7

# ---------- Base ----------
FROM oven/bun:latest AS base
WORKDIR /app

# ---------- Dependencies ----------
FROM base AS deps
COPY package.json bun.lock* bunfig.toml ./
RUN bun install --frozen-lockfile

# ---------- Build ----------
FROM base AS build
ENV NODE_ENV=production
# Build TanStack Start against the Node server preset instead of the
# default Cloudflare Workers target so the output runs in a Node runtime.
ENV NITRO_PRESET=node-server
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# ---------- Runtime ----------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Nitro node-server preset emits a self-contained bundle in .output/
COPY --from=build /app/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
