FROM node:18-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps && npm cache clean --force

#Stage 2: build the app

FROM node:18-alpine AS build

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

RUN NODE_OPTIONS=--openssl-legacy-provider npm run build

#Stage 3: production image
FROM node:18-alpine AS production

ENV NODE_ENV=production

# Create user first
RUN addgroup -g 1002 -S frontend && adduser -S frontend -u 1002

WORKDIR /app

# Install serve
RUN npm install -g serve

COPY --from=build --chown=frontend:frontend /app/build ./build

# Set ownership of /app directory
RUN chown -R frontend:frontend /app

USER frontend

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["serve", "-s", "build", "-l", "3000"]