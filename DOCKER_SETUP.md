# Docker Setup Guide

## Overview

This project is fully containerized with Docker. You can run the entire application stack (Frontend, Backend, and MongoDB) using Docker and Docker Compose.

## Prerequisites

- Docker (v20.10+)
- Docker Compose (v1.29+)
- 4GB+ RAM available

## File Structure

```
Naksh_assignment/
├── Backend/
│   ├── Dockerfile           # Backend container configuration
│   └── .dockerignore        # Files to exclude from build
├── Frontend/frontend/
│   ├── Dockerfile           # Frontend container configuration
│   ├── nginx.conf           # Nginx server configuration
│   └── .dockerignore        # Files to exclude from build
├── docker-compose.yml       # Orchestrates all services
└── DOCKER_SETUP.md          # This file
```

## Quick Start

### Option 1: Run All Services with Docker Compose (Recommended)

```bash
# Navigate to project root
cd e:\Naksh_assignment

# Build and start all services
docker-compose up -d

# Check services status
docker-compose ps
```

Services will be available at:
- Frontend: http://localhost (port 80)
- Backend: http://localhost:5000 (port 5000)
- MongoDB: mongodb://admin:admin123@localhost:27017 (port 27017)

### Option 2: Build and Run Individual Services

#### Backend Service

```bash
# Build backend image
cd Backend
docker build -t shophub-backend .

# Run backend container
docker run -d \
  --name shophub-backend \
  -p 5000:5000 \
  -e MONGO_URI=mongodb://admin:admin123@localhost:27017/shophub \
  -e NODE_ENV=production \
  shophub-backend
```

#### Frontend Service

```bash
# Build frontend image
cd Frontend/frontend
docker build -t shophub-frontend .

# Run frontend container
docker run -d \
  --name shophub-frontend \
  -p 80:80 \
  shophub-frontend
```

## Environment Configuration

### Backend Environment Variables

The Backend container uses these environment variables:

```env
NODE_ENV=production
MONGO_URI=mongodb://admin:admin123@mongodb:27017/shophub?authSource=admin
PORT=5000
```

To use a different MongoDB connection string:

```bash
docker run -d \
  --name shophub-backend \
  -p 5000:5000 \
  -e MONGO_URI=your_mongodb_connection_string \
  shophub-backend
```

### Frontend Configuration

The Frontend is pre-configured to connect to the backend at `http://localhost:5000/api`. For production, update the API endpoints in the frontend environment if needed.

## Docker Compose Commands

### Start Services

```bash
# Start in background
docker-compose up -d

# Start with logs displayed
docker-compose up

# Rebuild images and start
docker-compose up -d --build
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (deletes database data)
docker-compose down -v
```

### View Logs

```bash
# View logs from all services
docker-compose logs -f

# View logs from specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# View last 100 lines
docker-compose logs --tail=100
```

### Service Management

```bash
# Restart a service
docker-compose restart backend

# Rebuild a specific service
docker-compose build --no-cache backend

# Execute command in running container
docker-compose exec backend npm run test

# View service statistics
docker-compose stats
```

## MongoDB Credentials

**Default Credentials:**
```
Username: admin
Password: admin123
Database: shophub
Connection String: mongodb://admin:admin123@mongodb:27017/shophub?authSource=admin
```

To change credentials, edit `docker-compose.yml`:

```yaml
environment:
  MONGO_INITDB_ROOT_USERNAME: your_username
  MONGO_INITDB_ROOT_PASSWORD: your_password
```

## Troubleshooting

### Port Already in Use

If port 5000, 80, or 27017 is already in use:

```bash
# Change ports in docker-compose.yml
# Example: Change frontend port from 80 to 8080
ports:
  - "8080:80"  # External:Internal
```

### Container Won't Start

```bash
# Check container logs
docker-compose logs backend

# Check if image was built successfully
docker images

# Remove stopped containers and rebuild
docker-compose down
docker-compose up -d --build
```

### MongoDB Connection Failed

```bash
# Verify MongoDB container is running
docker-compose ps

# Check MongoDB logs
docker-compose logs mongodb

# Test connection
docker-compose exec mongodb mongosh
```

### Frontend Can't Connect to Backend

1. Verify backend is running: `docker-compose ps`
2. Check backend logs: `docker-compose logs backend`
3. Ensure network connectivity: `docker network ls`

## Performance Optimization

### Image Sizes

To check image sizes:
```bash
docker images | grep shophub
```

To reduce image size, use multi-stage builds (already implemented in Frontend).

### Container Resource Limits

Add resource limits in `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## Production Deployment

### For AWS/Heroku/Railway:

1. **Build images:**
   ```bash
   docker build -t your-registry/shophub-backend Backend/
   docker build -t your-registry/shophub-frontend Frontend/frontend/
   ```

2. **Push to registry:**
   ```bash
   docker push your-registry/shophub-backend
   docker push your-registry/shophub-frontend
   ```

3. **Deploy:** Use the `docker-compose.yml` as reference or use Kubernetes manifest

### Environment Variables for Production:

Set these in your production environment:
- `MONGO_URI` - Production MongoDB connection string
- `NODE_ENV=production`
- Frontend API endpoints pointing to production backend

## Useful Docker Commands

```bash
# Clean up unused images and containers
docker system prune

# Remove specific image
docker rmi shophub-backend

# View container processes
docker top container_name

# Copy files from container
docker cp container_name:/path/to/file ./local/path

# Inspect container details
docker inspect container_name

# Enter container shell
docker exec -it container_name /bin/sh
```

## Security Best Practices

1. Use `.dockerignore` to exclude sensitive files (already included)
2. Never commit `.env` files with secrets
3. Use secrets management for production (AWS Secrets Manager, HashiCorp Vault)
4. Regularly update base images: `node:18-alpine`, `nginx:alpine`, `mongo:7.0`
5. Use non-root user in Dockerfile for production

## Health Checks

All services include health checks:

```bash
# Check service health
docker-compose ps

# Check specific service health
docker inspect --format='{{json .State.Health}}' shophub-backend
```

## Monitoring and Logging

```bash
# Real-time stats
docker stats

# Container logs with timestamps
docker logs --timestamps backend_container

# View specific number of logs
docker logs --tail=200 backend_container
```

## Next Steps

1. Start services: `docker-compose up -d`
2. Access frontend: http://localhost
3. Monitor logs: `docker-compose logs -f`
4. Stop services: `docker-compose down`

For more Docker documentation: https://docs.docker.com/
