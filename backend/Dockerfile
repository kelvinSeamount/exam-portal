#Stage 1: install dependencies
FROM node:18-alpine AS dependencies

WORKDIR /app

# Install build dependencies for native modules like bcrypt
RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

#Stage 2: build the app
FROM node:18-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

# Create user first
RUN addgroup -g 1001 -S nodejs &&  adduser -S nodejs -u 1001

# Copy with ownership to nodejs user
COPY --from=dependencies --chown=nodejs:nodejs /app/node_modules ./node_modules

COPY --chown=nodejs:nodejs . .


# Set ownership of /app directory itself
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/v1/public', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
  
CMD ["node", "index.js"]