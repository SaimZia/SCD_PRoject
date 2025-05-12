# Stage 1: Build the React frontend
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY app/Frontend/package*.json ./
RUN npm install
COPY app/Frontend/ .
RUN npm run build

# Stage 2: Build the Node.js backend
FROM node:18 AS backend-build
WORKDIR /app/backend
COPY app/Backend/package*.json ./
RUN npm install
COPY app/Backend/ .

# Stage 3: Serve the frontend
FROM nginx:alpine AS frontend
COPY --from=frontend-build /app/frontend/build /usr/share/nginx/html
EXPOSE 80

# Stage 4: Run the backend
FROM node:18 AS backend
WORKDIR /app/backend
COPY --from=backend-build /app/backend .
EXPOSE 5000
CMD ["node", "Server.js"]