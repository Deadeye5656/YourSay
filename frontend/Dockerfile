# Frontend-only Dockerfile for YourSay application
FROM node:20-slim AS build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . ./

# Build the application
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Copy package files for production dependencies
COPY package*.json ./
RUN npm install --production

# Copy built application
COPY --from=build /app/dist ./dist
COPY --from=build /app/src ./src
COPY --from=build /app/public ./public
COPY --from=build /app/index.html ./
COPY --from=build /app/vite.config.js ./

# Install development dependencies for dev server
RUN npm install

# Expose port
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]