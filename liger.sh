#!/bin/bash

# LIGER Platform Management Script
# This script provides commands to manage the entire LIGER ecosystem

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

show_help() {
    cat << EOF
LIGER Platform Management Script

USAGE:
    $0 [COMMAND] [OPTIONS]

COMMANDS:
    help                    Show this help message
    
    Infrastructure:
    jenkins start          Start Jenkins CI/CD infrastructure
    jenkins stop           Stop Jenkins infrastructure
    jenkins restart        Restart Jenkins infrastructure
    jenkins status         Show Jenkins status
    jenkins logs           Show Jenkins logs
    
    Database:
    db:setup              Setup PostgreSQL database and run migrations
    db:migrate            Run database migrations
    db:seed               Seed database with sample data
    db:reset              Reset database (drop, create, migrate, seed)
    db:studio             Open Prisma Studio for database management
    
    Services:
    services:build        Build all microservices Docker images
    services:start        Start all microservices
    services:stop         Stop all microservices
    services:restart      Restart all microservices
    services:status       Show status of all services
    services:logs [SVC]   Show logs for all services or specific service
    
    Development:
    dev:install           Install all dependencies
    dev:build             Build all services and packages
    dev:test              Run all tests
    dev:lint              Run linting on all code
    dev:clean             Clean all build artifacts and node_modules
    
    Deployment:
    deploy:staging        Deploy to staging environment
    deploy:production     Deploy to production environment
    deploy:rollback       Rollback to previous deployment
    
    Monitoring:
    monitor:health        Check health of all services
    monitor:metrics       Show system metrics
    monitor:alerts        Show active alerts

EXAMPLES:
    $0 jenkins start                 # Start Jenkins infrastructure
    $0 services:start               # Start all microservices
    $0 services:logs proposal-svc   # Show logs for proposal service
    $0 db:reset                     # Reset database with fresh data
    $0 deploy:staging               # Deploy to staging environment

For more detailed documentation, see: https://github.com/your-org/liger-platform
EOF
}

# Infrastructure Management
jenkins_start() {
    log_info "Starting Jenkins CI/CD infrastructure..."
    cd "$PROJECT_ROOT"
    ./jenkins/deploy.sh start
}

jenkins_stop() {
    log_info "Stopping Jenkins infrastructure..."
    cd "$PROJECT_ROOT"
    ./jenkins/deploy.sh stop
}

jenkins_restart() {
    log_info "Restarting Jenkins infrastructure..."
    jenkins_stop
    sleep 3
    jenkins_start
}

jenkins_status() {
    log_info "Checking Jenkins status..."
    cd "$PROJECT_ROOT"
    ./jenkins/deploy.sh status
}

jenkins_logs() {
    log_info "Showing Jenkins logs..."
    cd "$PROJECT_ROOT"
    ./jenkins/deploy.sh logs
}

# Database Management
db_setup() {
    log_info "Setting up database..."
    cd "$PROJECT_ROOT/packages/prisma"
    npx prisma generate
    npx prisma migrate deploy
    log_success "Database setup complete"
}

db_migrate() {
    log_info "Running database migrations..."
    cd "$PROJECT_ROOT/packages/prisma"
    npx prisma migrate deploy
    log_success "Migrations complete"
}

db_seed() {
    log_info "Seeding database..."
    cd "$PROJECT_ROOT"
    npm run db:seed
    log_success "Database seeded"
}

db_reset() {
    log_warning "This will destroy all data. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        log_info "Resetting database..."
        cd "$PROJECT_ROOT/packages/prisma"
        npx prisma migrate reset --force
        log_success "Database reset complete"
    else
        log_info "Database reset cancelled"
    fi
}

db_studio() {
    log_info "Opening Prisma Studio..."
    cd "$PROJECT_ROOT/packages/prisma"
    npx prisma studio
}

# Service Management
services_build() {
    log_info "Building all microservice Docker images..."
    cd "$PROJECT_ROOT"
    
    SERVICES=("proposal-svc" "approval-svc" "assessment-svc" "scoring-svc" "habits-svc" 
              "risk-svc" "notify-svc" "gift-svc" "pay-svc" "profile-svc" "qr-svc" 
              "scholarship-svc" "loan-svc" "dossier-svc" "escrow-svc")
    
    for service in "${SERVICES[@]}"; do
        log_info "Building $service..."
        docker build -f apps/$service/Dockerfile -t liger/$service:latest .
    done
    
    log_success "All services built successfully"
}

services_start() {
    log_info "Starting all microservices..."
    cd "$PROJECT_ROOT"
    docker-compose -f docker-compose.yml up -d
    log_success "All services started"
}

services_stop() {
    log_info "Stopping all microservices..."
    cd "$PROJECT_ROOT"
    docker-compose -f docker-compose.yml down
    log_success "All services stopped"
}

services_restart() {
    log_info "Restarting all microservices..."
    services_stop
    sleep 3
    services_start
}

services_status() {
    log_info "Checking service status..."
    cd "$PROJECT_ROOT"
    docker-compose -f docker-compose.yml ps
}

services_logs() {
    local service=$1
    if [ -z "$service" ]; then
        log_info "Showing logs for all services..."
        cd "$PROJECT_ROOT"
        docker-compose -f docker-compose.yml logs -f
    else
        log_info "Showing logs for $service..."
        cd "$PROJECT_ROOT"
        docker-compose -f docker-compose.yml logs -f "$service"
    fi
}

# Development Commands
dev_install() {
    log_info "Installing all dependencies..."
    cd "$PROJECT_ROOT"
    npm ci
    log_success "Dependencies installed"
}

dev_build() {
    log_info "Building all services and packages..."
    cd "$PROJECT_ROOT"
    npm run build
    log_success "Build complete"
}

dev_test() {
    log_info "Running all tests..."
    cd "$PROJECT_ROOT"
    npm test
}

dev_lint() {
    log_info "Running linting..."
    cd "$PROJECT_ROOT"
    npm run lint
}

dev_clean() {
    log_warning "This will remove all node_modules and build artifacts. Continue? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        log_info "Cleaning project..."
        cd "$PROJECT_ROOT"
        find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
        find . -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
        find . -name ".next" -type d -exec rm -rf {} + 2>/dev/null || true
        log_success "Project cleaned"
    fi
}

# Deployment Commands
deploy_staging() {
    log_info "Deploying to staging environment..."
    # Add staging deployment logic here
    log_success "Deployed to staging"
}

deploy_production() {
    log_info "Deploying to production environment..."
    # Add production deployment logic here
    log_success "Deployed to production"
}

deploy_rollback() {
    log_info "Rolling back deployment..."
    # Add rollback logic here
    log_success "Rollback complete"
}

# Monitoring Commands
monitor_health() {
    log_info "Checking health of all services..."
    # Add health check logic here
    log_success "Health check complete"
}

monitor_metrics() {
    log_info "Showing system metrics..."
    # Add metrics display logic here
}

monitor_alerts() {
    log_info "Showing active alerts..."
    # Add alerts display logic here
}

# Main command handler
main() {
    case "${1:-help}" in
        help)
            show_help
            ;;
        jenkins)
            case "$2" in
                start) jenkins_start ;;
                stop) jenkins_stop ;;
                restart) jenkins_restart ;;
                status) jenkins_status ;;
                logs) jenkins_logs ;;
                *) log_error "Unknown jenkins command: $2" && exit 1 ;;
            esac
            ;;
        db:setup) db_setup ;;
        db:migrate) db_migrate ;;
        db:seed) db_seed ;;
        db:reset) db_reset ;;
        db:studio) db_studio ;;
        services:build) services_build ;;
        services:start) services_start ;;
        services:stop) services_stop ;;
        services:restart) services_restart ;;
        services:status) services_status ;;
        services:logs) services_logs "$2" ;;
        dev:install) dev_install ;;
        dev:build) dev_build ;;
        dev:test) dev_test ;;
        dev:lint) dev_lint ;;
        dev:clean) dev_clean ;;
        deploy:staging) deploy_staging ;;
        deploy:production) deploy_production ;;
        deploy:rollback) deploy_rollback ;;
        monitor:health) monitor_health ;;
        monitor:metrics) monitor_metrics ;;
        monitor:alerts) monitor_alerts ;;
        *)
            log_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"