# syntax=docker/dockerfile:1

# ---- base: Node 22 (o Next 16 exige Node >= 20.9) ----
FROM node:22-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---- deps: dependências instaladas a partir do lockfile ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

# ---- dev: usado pelo docker-compose (código montado como volume, com hot reload) ----
FROM deps AS dev
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"]

# As etapas de build estático e a imagem final com nginx entram na fase 7.
