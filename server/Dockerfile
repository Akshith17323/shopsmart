FROM node:20-alpine

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Requirement 2: Run as a non-root user
USER node

# Ensure the app binds to the correct port expected by ECS
ENV PORT=3000

# Requirement 3: Healthcheck configured
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

EXPOSE 3000

CMD ["node", "src/index.js"]
