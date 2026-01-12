# Agent Health API

A production-ready health check microservice API with monitoring, logging, and automated CI/CD pipeline.

## Overview

This service provides comprehensive health check endpoints for monitoring system status, dependencies, and overall application health.

## Features

- ✅ Health check endpoints (live, ready, health)
- ✅ System metrics (CPU, memory, disk usage)
- ✅ Dependency health checks (database, external APIs)
- ✅ Structured logging with correlation IDs
- ✅ Request tracing and monitoring
- ✅ Docker containerization
- ✅ Jenkins CI/CD pipeline
- ✅ Comprehensive API documentation
- ✅ Production-ready configuration

## API Endpoints

### GET /health
Comprehensive health check with system metrics and dependencies

### GET /health/live
Liveness probe - is the application running?

### GET /health/ready
Readiness probe - is the application ready to serve traffic?

### GET /health/status
Detailed status information with version and timestamp

## Quick Start

### Local Development
```bash
npm install
npm start
```

### Docker
```bash
docker build -t agent-health .
docker run -p 3000:3000 agent-health
```

## API Documentation

Once running, visit: `http://localhost:3000/docs`

## Jenkins Pipeline

The repository includes a complete Jenkinsfile for CI/CD:
- Automated testing
- Docker build & push
- Deployment orchestration

## Monitoring

Health endpoint returns:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "uptime": 1234.56,
  "system": {
    "cpu": 45.2,
    "memory": 62.1,
    "disk": 78.3
  },
  "dependencies": {
    "database": "connected",
    "external_api": "ok"
  }
}
```

## License

MIT