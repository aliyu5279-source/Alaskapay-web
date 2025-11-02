#!/bin/bash

# Docker Build and Deploy Script
# One-command Docker deployment

set -e

echo "🐳 AlaskaPay Docker Build & Deploy"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    echo "Please install Docker from: https://www.docker.com/get-started"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker is not running!${NC}"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

echo -e "${GREEN}✓ Docker is installed and running${NC}"
echo ""

# Build production image
echo -e "${BLUE}📦 Building production Docker image...${NC}"
docker build -t alaskapay-app:latest .

echo ""
echo -e "${GREEN}✓ Build complete!${NC}"
echo ""

# Stop and remove existing container
echo -e "${BLUE}🔄 Stopping existing container (if any)...${NC}"
docker stop alaskapay-app 2>/dev/null || true
docker rm alaskapay-app 2>/dev/null || true

echo ""
echo -e "${BLUE}🚀 Starting container...${NC}"
docker run -d \
  --name alaskapay-app \
  -p 8080:8080 \
  --restart unless-stopped \
  alaskapay-app:latest

echo ""
echo -e "${GREEN}✅ SUCCESS! Your app is running!${NC}"
echo ""
echo "🌐 Open your browser and visit:"
echo -e "${BLUE}   http://localhost:8080${NC}"
echo ""
echo "📊 View logs:"
echo "   docker logs -f alaskapay-app"
echo ""
echo "🛑 Stop container:"
echo "   docker stop alaskapay-app"
