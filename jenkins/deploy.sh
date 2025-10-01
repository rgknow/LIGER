#!/bin/bash

# LIGER Platform Jenkins Deployment Script
# Usage: ./deploy.sh [start|stop|restart|logs]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCKER_COMPOSE_FILE="${SCRIPT_DIR}/docker-compose.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    log_info "Checking requirements..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed or not in PATH"
        exit 1
    fi
    
    log_info "Requirements check passed"
}

generate_agent_secret() {
    if [ ! -f "${SCRIPT_DIR}/.env" ]; then
        log_info "Generating Jenkins agent secret..."
        echo "JENKINS_AGENT_SECRET=$(openssl rand -hex 32)" > "${SCRIPT_DIR}/.env"
        log_info "Agent secret generated and saved to .env file"
    fi
}

start_jenkins() {
    log_info "Starting LIGER Jenkins infrastructure..."
    
    check_requirements
    generate_agent_secret
    
    # Create necessary directories
    mkdir -p "${SCRIPT_DIR}/jenkins_data"
    mkdir -p "${SCRIPT_DIR}/jenkins_data/casc_configs"
    
    # Set proper permissions
    sudo chown -R 1000:1000 "${SCRIPT_DIR}/jenkins_data"
    
    # Start services
    cd "${SCRIPT_DIR}"
    docker-compose --env-file .env up -d
    
    log_info "Jenkins is starting up..."
    log_info "Web UI will be available at: http://localhost:8080"
    log_info "Default credentials: admin/admin123"
    
    # Wait for Jenkins to be ready
    log_info "Waiting for Jenkins to be ready..."
    timeout 300 bash -c 'until curl -f -s http://localhost:8080/login > /dev/null; do sleep 5; done' || {
        log_error "Jenkins failed to start within 5 minutes"
        exit 1
    }
    
    log_info "Jenkins is ready!"
    log_info "You can now access Jenkins at http://localhost:8080"
}

stop_jenkins() {
    log_info "Stopping LIGER Jenkins infrastructure..."
    
    cd "${SCRIPT_DIR}"
    docker-compose down
    
    log_info "Jenkins infrastructure stopped"
}

restart_jenkins() {
    log_info "Restarting LIGER Jenkins infrastructure..."
    stop_jenkins
    sleep 5
    start_jenkins
}

show_logs() {
    log_info "Showing Jenkins logs..."
    cd "${SCRIPT_DIR}"
    docker-compose logs -f jenkins
}

backup_jenkins() {
    log_info "Creating Jenkins backup..."
    
    BACKUP_DIR="${SCRIPT_DIR}/backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "${BACKUP_DIR}"
    
    # Backup Jenkins home
    docker-compose exec -T jenkins tar czf - /var/jenkins_home | gzip > "${BACKUP_DIR}/jenkins_home.tar.gz"
    
    # Backup database
    docker-compose exec -T postgres pg_dump -U liger_user liger_db | gzip > "${BACKUP_DIR}/postgres_dump.sql.gz"
    
    log_info "Backup created at: ${BACKUP_DIR}"
}

restore_jenkins() {
    if [ -z "$1" ]; then
        log_error "Please provide backup directory path"
        exit 1
    fi
    
    BACKUP_DIR="$1"
    
    if [ ! -d "${BACKUP_DIR}" ]; then
        log_error "Backup directory not found: ${BACKUP_DIR}"
        exit 1
    fi
    
    log_info "Restoring Jenkins from backup: ${BACKUP_DIR}"
    
    # Stop services
    stop_jenkins
    
    # Restore Jenkins home
    if [ -f "${BACKUP_DIR}/jenkins_home.tar.gz" ]; then
        log_info "Restoring Jenkins home..."
        rm -rf "${SCRIPT_DIR}/jenkins_data"
        mkdir -p "${SCRIPT_DIR}/jenkins_data"
        gunzip -c "${BACKUP_DIR}/jenkins_home.tar.gz" | tar xf - -C "${SCRIPT_DIR}/jenkins_data" --strip-components=3
    fi
    
    # Start services
    start_jenkins
    
    # Restore database
    if [ -f "${BACKUP_DIR}/postgres_dump.sql.gz" ]; then
        log_info "Restoring database..."
        gunzip -c "${BACKUP_DIR}/postgres_dump.sql.gz" | docker-compose exec -T postgres psql -U liger_user -d liger_db
    fi
    
    log_info "Restore completed"
}

show_status() {
    log_info "LIGER Jenkins Infrastructure Status:"
    cd "${SCRIPT_DIR}"
    docker-compose ps
}

case "${1:-start}" in
    start)
        start_jenkins
        ;;
    stop)
        stop_jenkins
        ;;
    restart)
        restart_jenkins
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    backup)
        backup_jenkins
        ;;
    restore)
        restore_jenkins "$2"
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|logs|status|backup|restore <backup_dir>}"
        exit 1
        ;;
esac