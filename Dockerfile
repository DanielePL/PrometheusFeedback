# Prometheus Feedback - Railway Deployment
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies
RUN npm ci --only=production
RUN cd server && npm ci --only=production
RUN cd client && npm ci

# Copy source code
COPY . .

# Build client for production
RUN cd client && npm run build

# Create uploads directory
RUN mkdir -p server/uploads/screenshots

# Set environment to production
ENV NODE_ENV=production

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]