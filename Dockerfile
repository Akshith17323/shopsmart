# -----------------------------------------
# Stage 1: Build the React Frontend
# -----------------------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY client/package*.json ./
RUN npm install

# Copy the rest of the client source code and build it
COPY client/ ./
RUN npm run build

# -----------------------------------------
# Stage 2: Serve with Nginx (Non-root)
# -----------------------------------------
FROM nginx:alpine

# Requirement 2: Run as a non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Adjust permissions for Nginx to run as non-root
RUN chown -R appuser:appgroup /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html /etc/nginx/conf.d

# Copy the React build from Stage 1
COPY --from=build --chown=appuser:appgroup /app/dist /usr/share/nginx/html

# Configure Nginx to listen on port 3000 (Matches our ecs.tf configuration)
RUN echo "server { listen 3000; root /usr/share/nginx/html; index index.html; location / { try_files \$uri \$uri/ /index.html; } }" > /etc/nginx/conf.d/default.conf
RUN chown appuser:appgroup /etc/nginx/conf.d/default.conf

# Switch to the non-root user
USER appuser

# Requirement 3: Healthcheck configured
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

# Expose the port
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
