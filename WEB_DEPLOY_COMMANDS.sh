#!/bin/bash

# Alaska Pay - Web Deployment Commands
# Quick reference for deploying the web application

set -e

echo "🚀 Alaska Pay - Web Deployment Commands"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Show menu
echo "Select deployment option:"
echo "1. Deploy to Staging"
echo "2. Deploy to Production"
echo "3. Build Only (no deploy)"
echo "4. Preview Deploy"
echo "5. Rollback to Previous"
echo "6. Check Deployment Status"
echo "7. View Deployment Logs"
echo "8. Run Pre-Deploy Checks"
echo "9. Full Production Deploy (with checks)"
echo "0. Exit"
echo ""
read -p "Enter option (0-9): " option

case $option in
    1)
        print_step "Deploying to Staging..."
        npm run build
        netlify deploy --alias staging
        print_success "Staging deployment complete!"
        echo "View at: https://staging--alaskapay.netlify.app"
        ;;
    
    2)
        print_warning "Deploying to PRODUCTION..."
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            npm run build
            netlify deploy --prod
            print_success "Production deployment complete!"
            echo "View at: https://alaskapay.com"
        else
            print_error "Deployment cancelled"
        fi
        ;;
    
    3)
        print_step "Building application..."
        npm run build
        print_success "Build complete! Output in dist/"
        ;;
    
    4)
        print_step "Creating preview deploy..."
        npm run build
        netlify deploy
        print_success "Preview deploy complete!"
        ;;
    
    5)
        print_warning "Rolling back to previous deployment..."
        netlify rollback
        print_success "Rollback complete!"
        ;;
    
    6)
        print_step "Checking deployment status..."
        netlify status
        netlify sites:list
        ;;
    
    7)
        print_step "Fetching deployment logs..."
        netlify logs
        ;;
    
    8)
        print_step "Running pre-deployment checks..."
        
        # Check if .env exists
        if [ -f .env ]; then
            print_success ".env file exists"
        else
            print_error ".env file missing!"
        fi
        
        # Run tests
        print_step "Running tests..."
        npm test -- --run
        
        # Run linter
        print_step "Running linter..."
        npm run lint
        
        # Check build
        print_step "Testing build..."
        npm run build
        
        print_success "All pre-deployment checks passed!"
        ;;
    
    9)
        print_step "Starting full production deployment..."
        
        # Pre-deployment checks
        print_step "1/6 Running tests..."
        npm test -- --run || { print_error "Tests failed!"; exit 1; }
        
        print_step "2/6 Running linter..."
        npm run lint || { print_error "Linting failed!"; exit 1; }
        
        print_step "3/6 Building application..."
        npm run build || { print_error "Build failed!"; exit 1; }
        
        print_step "4/6 Creating backup tag..."
        git tag -a "backup-$(date +%Y%m%d-%H%M%S)" -m "Backup before deployment"
        git push origin --tags
        
        print_step "5/6 Deploying to production..."
        netlify deploy --prod || { print_error "Deployment failed!"; exit 1; }
        
        print_step "6/6 Running smoke tests..."
        sleep 5
        curl -f https://alaskapay.com || { print_error "Site not responding!"; exit 1; }
        
        print_success "Full production deployment complete!"
        print_success "Site is live at: https://alaskapay.com"
        ;;
    
    0)
        echo "Exiting..."
        exit 0
        ;;
    
    *)
        print_error "Invalid option"
        exit 1
        ;;
esac

echo ""
echo "========================================"
echo "Deployment script complete!"
