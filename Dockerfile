# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build NestJS project
RUN npm run build

# ---------- Production Stage ----------
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy built application
COPY --from=builder /app/dist ./dist

# Copy Prisma files
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Expose application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/src/main.js"]