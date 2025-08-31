# Use Node.js 18 as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm install
RUN npm install --prefix frontend
RUN npm install --prefix backend

# Copy source code
COPY . .

# Build frontend
RUN npm run build --prefix frontend

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
