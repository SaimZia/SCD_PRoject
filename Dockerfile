# Stage 1: Build the React frontend
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
COPY app/Frontend/package*.json ./
RUN npm install
COPY app/Frontend/ .
RUN npm run build

# Stage 2: Build the Node.js backend
FROM node:20-slim AS backend-build
WORKDIR /app/backend
COPY app/Backend/package*.json ./
RUN npm install
COPY app/Backend/ .

# Stage 3: Serve the frontend
FROM nginx:1.25-alpine AS frontend
# Create necessary directories and set permissions for nginx
RUN mkdir -p /var/cache/nginx /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp /var/cache/nginx/uwsgi_temp /var/cache/nginx/scgi_temp \
    && chown -R nginx:nginx /var/cache/nginx \
    && chmod -R 700 /var/cache/nginx \
    && chown -R nginx:nginx /var/log/nginx \
    && chmod -R 700 /var/log/nginx \
    && touch /var/run/nginx.pid \
    && chown nginx:nginx /var/run/nginx.pid \
    && chmod 700 /var/run/nginx.pid

COPY --from=frontend-build /app/frontend/build /usr/share/nginx/html
# Add a custom Nginx configuration to handle React routing
COPY app/Frontend/nginx.conf /etc/nginx/conf.d/default.conf
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Switch to non-root user (nginx user already exists)
USER nginx

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Stage 4: Run the backend
FROM node:20-slim AS backend
WORKDIR /app/backend

# Create a non-root user
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs

COPY --from=backend-build --chown=nodejs:nodejs /app/backend .

# Switch to non-root user
USER nodejs

EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=3s \
    CMD node -e "require('http').get('http://localhost:5000/health', (res) => res.statusCode === 200 ? process.exit(0) : process.exit(1))" || exit 1

CMD ["node", "Server.js"]