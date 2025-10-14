### --- Frontend Build Stage --- ###
FROM node:20-alpine AS frontend

WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ ./
RUN npm run build --prod

### --- Backend Build Stage --- ###
FROM node:20-alpine AS backend

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PASSWORD=qwerty

WORKDIR /usr/src/app

# Copy backend package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy backend source
COPY . .

# Copy built frontend to backend's public directory
COPY --from=frontend /app/frontend/dist/frontend/browser ./frontend/dist

# Expose default port
EXPOSE 3000

# Default command
CMD ["node", "app.js"]
