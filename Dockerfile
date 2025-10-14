FROM node:20-alpine

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PASSWORD=qwerty

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy application source
COPY . .

# Expose default port
EXPOSE 3000

# Default command
CMD ["node", "app.js"]
