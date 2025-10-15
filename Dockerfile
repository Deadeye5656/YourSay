# Multi-stage Dockerfile for YourSay application
# Stage 1: Build frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Stage 2: Build backend
FROM maven:3.9-openjdk-17 AS backend-build

WORKDIR /app/backend
COPY backend/pom.xml ./
COPY backend/mvnw ./
COPY backend/mvnw.cmd ./
COPY backend/.mvn .mvn/

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Stage 3: Runtime environment
FROM openjdk:17-jdk-slim

# Install Node.js for running the frontend in development mode
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built backend jar
COPY --from=backend-build /app/backend/target/*.jar app.jar

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Copy frontend source for development
COPY frontend/ ./frontend/

# Install frontend dependencies in runtime
WORKDIR /app/frontend
RUN npm install

WORKDIR /app

# Expose ports
EXPOSE 8080 5173

# Create startup script
RUN echo '#!/bin/bash\n\
# Start backend in background\n\
java -jar app.jar &\n\
BACKEND_PID=$!\n\
\n\
# Start frontend in development mode\n\
cd frontend\n\
npm run dev -- --host 0.0.0.0 &\n\
FRONTEND_PID=$!\n\
\n\
# Wait for both processes\n\
wait $BACKEND_PID $FRONTEND_PID' > start.sh && chmod +x start.sh

CMD ["./start.sh"]