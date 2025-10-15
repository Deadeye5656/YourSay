# YourSay Docker Setup

This repository contains Docker configurations to run the YourSay application with both frontend and backend services.

## Available Docker Configurations

### 1. Single Container (Dockerfile)
Runs both frontend and backend in a single container.

```powershell
# Build and run the application
docker build -t yoursay-app .
docker run -p 8080:8080 -p 5173:5173 yoursay-app
```

### 2. Multi-Container Setup (docker-compose.yml)
Runs frontend and backend in a single container using docker-compose.

```powershell
docker-compose up --build
```

### 3. Separate Containers (docker-compose.dev.yml) - Recommended for Development
Runs frontend and backend in separate containers for better development experience.

```powershell
docker-compose -f docker-compose.dev.yml up --build
```

## Services and Ports

- **Backend (Spring Boot)**: http://localhost:8080
- **Frontend (Vite + React)**: http://localhost:5173

## Development Features

### Hot Reload
When using `docker-compose.dev.yml`, the frontend supports hot reload:
- Changes to files in `frontend/src/` are automatically reflected
- No need to rebuild the container for frontend changes

### Health Checks
The backend service includes health checks available at:
- http://localhost:8080/actuator/health

## Environment Configuration

### Backend Environment Variables
You can override Spring Boot properties using environment variables:

```yaml
environment:
  - SPRING_PROFILES_ACTIVE=docker
  - SPRING_DATASOURCE_URL=jdbc:h2:mem:testdb
  - SERVER_PORT=8080
```

### Frontend Environment Variables
Configure API endpoints and other settings:

```yaml
environment:
  - VITE_API_BASE_URL=http://backend:8080
```

## Commands

### Build Only
```powershell
# Single container
docker build -t yoursay-app .

# Multi-container
docker-compose build
docker-compose -f docker-compose.dev.yml build
```

### Run in Background
```powershell
docker-compose up -d
docker-compose -f docker-compose.dev.yml up -d
```

### Stop Services
```powershell
docker-compose down
docker-compose -f docker-compose.dev.yml down
```

### View Logs
```powershell
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
```

### Rebuild After Changes
```powershell
# Backend changes
docker-compose -f docker-compose.dev.yml up --build backend

# Frontend changes (hot reload should handle this automatically)
docker-compose -f docker-compose.dev.yml restart frontend
```

## Troubleshooting

### Port Conflicts
If ports 8080 or 5173 are already in use, modify the port mappings in the docker-compose files:

```yaml
ports:
  - "8081:8080"  # Change host port to 8081
  - "3000:5173"  # Change host port to 3000
```

### Build Issues
1. Ensure Docker is running
2. Clear Docker cache: `docker system prune`
3. Rebuild without cache: `docker-compose build --no-cache`

### Network Issues
If services can't communicate, check that they're on the same network:
```powershell
docker network ls
docker network inspect yoursay_yoursay-network
```

## Production Deployment

For production, you might want to:
1. Build the frontend for production (`npm run build`)
2. Serve frontend files through a web server (nginx)
3. Use environment-specific configurations
4. Set up proper database connections
5. Configure proper security settings

Example production dockerfile would build the frontend and serve static files rather than running the dev server.