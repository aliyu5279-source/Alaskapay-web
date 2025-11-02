# 🐳 Docker Quick Start Guide

Deploy your app in a Docker container with **ONE COMMAND**!

## Prerequisites

1. **Install Docker Desktop**
   - Windows/Mac: https://www.docker.com/get-started
   - Linux: `curl -fsSL https://get.docker.com | sh`

2. **Start Docker Desktop** (make sure it's running)

---

## 🚀 Quick Deploy (Production)

### Windows:
```bash
docker-build.bat
```

### Mac/Linux:
```bash
chmod +x docker-build.sh
./docker-build.sh
```

**That's it!** Your app will be running at: **http://localhost:8080**

---

## 🛠️ Development Mode (with hot reload)

### Using Docker Compose:
```bash
docker-compose --profile dev up app-dev
```

Your dev server will run at: **http://localhost:5173**

---

## 📋 Common Commands

### Production:
```bash
# Build and run
docker-compose up -d app

# View logs
docker-compose logs -f app

# Stop
docker-compose down

# Rebuild after changes
docker-compose up -d --build app
```

### Development:
```bash
# Start dev server
docker-compose --profile dev up app-dev

# Stop dev server
docker-compose --profile dev down
```

### Manual Docker Commands:
```bash
# Build image
docker build -t alaskapay-app .

# Run container
docker run -d -p 8080:8080 --name alaskapay-app alaskapay-app

# Stop container
docker stop alaskapay-app

# Remove container
docker rm alaskapay-app

# View logs
docker logs -f alaskapay-app
```

---

## 🌐 Deploy to Cloud

### Deploy to any cloud platform:

**AWS, Google Cloud, Azure, DigitalOcean:**
```bash
# Push to Docker Hub
docker tag alaskapay-app:latest yourusername/alaskapay-app
docker push yourusername/alaskapay-app

# Deploy on any platform that supports Docker
```

**Heroku:**
```bash
heroku container:push web
heroku container:release web
```

---

## 🔧 Troubleshooting

**Docker not found?**
- Install Docker Desktop and restart your terminal

**Port already in use?**
```bash
# Use different port
docker run -d -p 3000:8080 --name alaskapay-app alaskapay-app
```

**Build fails?**
```bash
# Clean build
docker system prune -a
docker-compose build --no-cache
```

---

## ✅ Benefits of Docker

✓ **Platform Independent** - Works on Windows, Mac, Linux
✓ **Consistent Environment** - Same setup everywhere
✓ **Easy Deployment** - One command to deploy anywhere
✓ **Isolated** - No conflicts with other apps
✓ **Scalable** - Easy to scale with orchestration tools
