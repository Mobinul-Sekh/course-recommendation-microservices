# -----------------------------
# 1️⃣ Build Stage
# -----------------------------
  FROM node:18-alpine AS builder

  # Set working directory
  WORKDIR /app
  
  # Copy package files
  COPY package*.json ./
  
  # Install dependencies
  RUN npm ci
  
  # Copy the rest of the app
  COPY . .
  
  # Build the Next.js app (production build)
  RUN npm run build
  
  # -----------------------------
  # 2️⃣ Production Stage
  # -----------------------------
  FROM node:18-alpine AS runner
  
  WORKDIR /app
  
  ENV NODE_ENV=production
  ENV PORT=3000
  
  # Copy only necessary output from builder
  COPY --from=builder /app/package*.json ./
  COPY --from=builder /app/.next ./.next
  
  # Install only production dependencies
  RUN npm ci --omit=dev
  
  # Expose port
  EXPOSE 3000
  
  # Start Next.js
  CMD ["npm", "start"]
  