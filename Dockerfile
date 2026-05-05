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

# Requirement 2: Run as a non-root user (Using the built-in 'nginx' user UID 101)
# Modify main nginx.conf to support non-root user by removing the user directive,
# moving the PID file to /tmp, and moving all temp directories to /tmp.
RUN sed -i '/user  nginx;/d' /etc/nginx/nginx.conf && \
    sed -i 's,/var/run/nginx.pid,/tmp/nginx.pid,' /etc/nginx/nginx.conf && \
    sed -i "/^http {/a \    proxy_temp_path /tmp/proxy_temp;\n    client_body_temp_path /tmp/client_temp;\n    fastcgi_temp_path /tmp/fastcgi_temp;\n    uwsgi_temp_path /tmp/uwsgi_temp;\n    scgi_temp_path /tmp/scgi_temp;\n" /etc/nginx/nginx.conf

# Adjust permissions for Nginx to run as non-root
RUN chown -R nginx:nginx /var/cache/nginx /var/log/nginx /usr/share/nginx/html /etc/nginx/conf.d /tmp

# Copy the React build from Stage 1
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Configure Nginx to listen on port 3000 (Matches our ecs.tf configuration)
RUN echo "server { listen 3000; root /usr/share/nginx/html; index index.html; location / { try_files \$uri \$uri/ /index.html; } }" > /etc/nginx/conf.d/default.conf
RUN chown nginx:nginx /etc/nginx/conf.d/default.conf

# Switch to the non-root user
USER nginx

# Requirement 3: Healthcheck configured
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

# Expose the port
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
