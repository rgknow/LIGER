# 🚀 LIGER Platform Deployment Manual

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Local Development](#local-development)
4. [Docker Deployment](#docker-deployment)
5. [Jenkins CI/CD Setup](#jenkins-cicd-setup)
6. [Production Deployment](#production-deployment)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

### System Requirements

#### Minimum Hardware:
- **CPU**: 4 cores (8 cores recommended for production)
- **RAM**: 8GB (16GB+ recommended for production)
- **Storage**: 50GB SSD (100GB+ for production)
- **Network**: Stable internet connection

#### Software Dependencies:
- **Node.js**: 18.x LTS or later
- **Docker**: 24.x or later
- **Docker Compose**: 2.x or later
- **Git**: Latest version
- **PostgreSQL**: 14.x or later (if not using Docker)
- **Redis**: 7.x or later (if not using Docker)

#### Supported Operating Systems:
- **Linux**: Ubuntu 20.04+, CentOS 8+, RHEL 8+
- **macOS**: 12.0+ (Monterey)
- **Windows**: Windows 11 (with WSL2)

### Required Accounts & Services:

#### Cloud Providers (Choose One):
- **AWS**: Account with EC2, RDS, ElastiCache access
- **Google Cloud**: Account with GCE, Cloud SQL access
- **Azure**: Account with VMs, Database services access
- **DigitalOcean**: Account with Droplets, Managed Databases

#### External Services:
- **GitHub**: Repository hosting and CI/CD
- **Docker Hub**: Container registry (or alternatives)
- **Domain Provider**: For custom domains
- **SSL Certificate**: Let's Encrypt or commercial

#### Payment Gateways (Optional):
- **Stripe**: For payment processing
- **PayPal**: Alternative payment method
- **Razorpay**: For Indian market support

---

## 2. Environment Setup

### 2.1 Clone Repository

```bash
# Clone the LIGER repository
git clone https://github.com/rgknow/LIGER.git
cd LIGER

# Switch to main branch
git checkout main

# Install dependencies
npm install
```

### 2.2 Environment Variables

Create environment files for different deployment stages:

#### Development Environment (`.env.development`)

```bash
# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/liger_dev"
REDIS_URL="redis://localhost:6379"

# JWT Configuration
JWT_SECRET="dev_jwt_secret_change_in_production"
JWT_EXPIRES_IN="7d"

# API Configuration
API_PORT=3000
API_HOST="localhost"

# Service Ports
PROPOSAL_SVC_PORT=3001
APPROVAL_SVC_PORT=3002
RISK_SVC_PORT=3003
NOTIFY_SVC_PORT=3006

# External Services (Development)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
PAYPAL_CLIENT_ID="paypal_sandbox_client_id"
PAYPAL_CLIENT_SECRET="paypal_sandbox_secret"

# Blockchain Configuration
POLYGON_RPC_URL="https://rpc-mumbai.maticvigil.com"
BLOCKCHAIN_PRIVATE_KEY="your_testnet_private_key"
CONTRACT_ADDRESS="your_deployed_contract_address"

# Email Service
EMAIL_SERVICE="sendgrid"
SENDGRID_API_KEY="your_sendgrid_api_key"
FROM_EMAIL="noreply@liger.local"

# File Storage
STORAGE_PROVIDER="local"
UPLOAD_PATH="./uploads"

# Security
ENCRYPTION_KEY="your_32_character_encryption_key_here"
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# Feature Flags
ENABLE_BLOCKCHAIN_ANCHORING=false
ENABLE_REAL_PAYMENTS=false
ENABLE_EMAIL_NOTIFICATIONS=true
```

#### Staging Environment (`.env.staging`)

```bash
# Database Configuration
DATABASE_URL="postgresql://postgres:password@staging-db:5432/liger_staging"
REDIS_URL="redis://staging-redis:6379"

# JWT Configuration
JWT_SECRET="staging_jwt_secret_different_from_dev"
JWT_EXPIRES_IN="24h"

# API Configuration
API_PORT=3000
API_HOST="0.0.0.0"

# External Services (Staging)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Blockchain Configuration
POLYGON_RPC_URL="https://rpc-mumbai.maticvigil.com"
BLOCKCHAIN_PRIVATE_KEY="staging_testnet_private_key"

# Security
ENCRYPTION_KEY="staging_32_character_encryption_key"
RATE_LIMIT_MAX=200
RATE_LIMIT_WINDOW=600000

# Feature Flags
ENABLE_BLOCKCHAIN_ANCHORING=true
ENABLE_REAL_PAYMENTS=false
ENABLE_EMAIL_NOTIFICATIONS=true
```

#### Production Environment (`.env.production`)

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@prod-db:5432/liger_prod"
REDIS_URL="redis://prod-redis:6379"

# JWT Configuration
JWT_SECRET="super_secure_production_jwt_secret"
JWT_EXPIRES_IN="1h"

# API Configuration
API_PORT=3000
API_HOST="0.0.0.0"

# External Services (Production)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
PAYPAL_CLIENT_ID="production_paypal_client_id"
PAYPAL_CLIENT_SECRET="production_paypal_secret"

# Blockchain Configuration
POLYGON_RPC_URL="https://polygon-rpc.com"
BLOCKCHAIN_PRIVATE_KEY="production_mainnet_private_key"

# Security
ENCRYPTION_KEY="production_32_character_encryption_key"
RATE_LIMIT_MAX=50
RATE_LIMIT_WINDOW=900000

# Feature Flags
ENABLE_BLOCKCHAIN_ANCHORING=true
ENABLE_REAL_PAYMENTS=true
ENABLE_EMAIL_NOTIFICATIONS=true

# Monitoring
SENTRY_DSN="your_sentry_dsn"
NEW_RELIC_LICENSE_KEY="your_new_relic_key"
```

### 2.3 SSL Certificates

For production deployment, obtain SSL certificates:

#### Using Let's Encrypt:

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com

# Verify auto-renewal
sudo certbot renew --dry-run
```

#### Using Custom Certificates:

```bash
# Place your certificates
mkdir -p /etc/ssl/certs/liger
cp your-certificate.crt /etc/ssl/certs/liger/
cp your-private-key.key /etc/ssl/private/liger/
```

---

## 3. Local Development

### 3.1 Quick Start

```bash
# Start infrastructure services
./liger.sh jenkins start

# Setup database
./liger.sh db:setup

# Install dependencies
./liger.sh dev:install

# Build all services
./liger.sh dev:build

# Run tests
./liger.sh dev:test

# Start development servers
npm run dev
```

### 3.2 Individual Service Development

#### Start Specific Services:

```bash
# Start proposal service
npm run dev:proposal-svc

# Start approval service
npm run dev:approval-svc

# Start API gateway
npm run dev:api-gateway
```

#### Service Development Workflow:

```bash
# Watch mode for development
npm run dev:watch --workspace=apps/proposal-svc

# Run service tests
npm test --workspace=apps/proposal-svc

# Build single service
npm run build --workspace=apps/proposal-svc
```

### 3.3 Database Management

#### Migrations:

```bash
# Create new migration
cd packages/prisma
npx prisma migrate dev --name add_new_feature

# Apply migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

#### Prisma Studio:

```bash
# Open Prisma Studio
./liger.sh db:studio

# Or directly
cd packages/prisma
npx prisma studio
```

---

## 4. Docker Deployment

### 4.1 Build Docker Images

#### Build All Services:

```bash
# Build all microservice images
./liger.sh services:build

# Or build individually
docker build -f apps/proposal-svc/Dockerfile -t liger/proposal-svc:latest .
docker build -f apps/approval-svc/Dockerfile -t liger/approval-svc:latest .
```

#### Tag for Registry:

```bash
# Tag for Docker Hub
docker tag liger/proposal-svc:latest your-username/liger-proposal-svc:v1.0.0

# Tag for private registry
docker tag liger/proposal-svc:latest registry.yourdomain.com/liger/proposal-svc:v1.0.0
```

### 4.2 Docker Compose Deployment

#### Development Deployment:

```bash
# Start all services
docker-compose -f docker-compose.yml up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Production Deployment:

```bash
# Use production compose file
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale proposal-svc=3
```

### 4.3 Docker Registry

#### Push to Docker Hub:

```bash
# Login to Docker Hub
docker login

# Push images
docker push your-username/liger-proposal-svc:v1.0.0
docker push your-username/liger-approval-svc:v1.0.0
```

#### Push to Private Registry:

```bash
# Login to private registry
docker login registry.yourdomain.com

# Push images
docker push registry.yourdomain.com/liger/proposal-svc:v1.0.0
```

---

## 5. Jenkins CI/CD Setup

### 5.1 Jenkins Installation

#### Start Jenkins Infrastructure:

```bash
# Start Jenkins with all dependencies
./liger.sh jenkins start

# Access Jenkins UI
open http://localhost:8080

# Default credentials: admin/admin123
```

#### Initial Jenkins Setup:

1. **Access Jenkins** at `http://your-server:8080`
2. **Install Suggested Plugins**
3. **Create Admin User**
4. **Configure System Settings**

### 5.2 Pipeline Configuration

#### Create Multibranch Pipeline:

1. **New Item** → **Multibranch Pipeline**
2. **Branch Sources** → **GitHub**
3. **Repository URL**: `https://github.com/rgknow/LIGER`
4. **Credentials**: Add GitHub token
5. **Build Configuration**: `Jenkinsfile`

#### Pipeline Environment Variables:

```groovy
// In Jenkins System Configuration
environment {
    DOCKER_REGISTRY = 'your-registry.com'
    KUBERNETES_NAMESPACE = 'liger-platform'
    STAGING_URL = 'https://staging.liger.com'
    PRODUCTION_URL = 'https://liger.com'
}
```

### 5.3 Deployment Stages

#### Pipeline Stages:

1. **Checkout**: Pull latest code
2. **Build**: Compile TypeScript and build Docker images
3. **Test**: Run unit and integration tests
4. **Security Scan**: Vulnerability scanning
5. **Deploy to Staging**: Automated staging deployment
6. **Integration Tests**: End-to-end testing
7. **Deploy to Production**: Manual approval required

#### Manual Approval Configuration:

```groovy
stage('Deploy to Production') {
    when {
        branch 'main'
    }
    steps {
        input message: 'Deploy to production?', ok: 'Deploy'
        // Production deployment steps
    }
}
```

---

## 6. Production Deployment

### 6.1 Cloud Infrastructure Setup

#### AWS Deployment:

```yaml
# Infrastructure as Code (Terraform)
# main.tf
resource "aws_instance" "liger_app" {
  ami           = "ami-0c02fb55956c7d316"
  instance_type = "t3.large"
  
  user_data = file("install_docker.sh")
  
  vpc_security_group_ids = [aws_security_group.liger_sg.id]
  
  tags = {
    Name = "LIGER-Platform"
  }
}

resource "aws_rds_instance" "liger_db" {
  identifier = "liger-postgres"
  engine     = "postgres"
  engine_version = "14.9"
  instance_class = "db.t3.micro"
  
  allocated_storage = 20
  storage_type     = "gp2"
  
  db_name  = "liger_prod"
  username = var.db_username
  password = var.db_password
  
  skip_final_snapshot = true
}
```

#### Google Cloud Deployment:

```yaml
# kubernetes/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: proposal-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: proposal-service
  template:
    metadata:
      labels:
        app: proposal-service
    spec:
      containers:
      - name: proposal-service
        image: gcr.io/your-project/liger-proposal-svc:latest
        ports:
        - containerPort: 3001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secrets
              key: url
```

### 6.2 Kubernetes Deployment

#### Deploy to Kubernetes:

```bash
# Create namespace
kubectl create namespace liger-platform

# Deploy secrets
kubectl apply -f kubernetes/secrets.yaml

# Deploy services
kubectl apply -f kubernetes/

# Check deployment status
kubectl get pods -n liger-platform
kubectl get services -n liger-platform
```

#### Kubernetes Ingress:

```yaml
# kubernetes/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: liger-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - api.liger.com
    secretName: liger-tls
  rules:
  - host: api.liger.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-gateway
            port:
              number: 3000
```

### 6.3 Load Balancer Configuration

#### NGINX Load Balancer:

```nginx
# /etc/nginx/sites-available/liger.com
upstream liger_api {
    server 10.0.1.10:3000;
    server 10.0.1.11:3000;
    server 10.0.1.12:3000;
}

server {
    listen 443 ssl http2;
    server_name api.liger.com;
    
    ssl_certificate /etc/ssl/certs/liger/fullchain.pem;
    ssl_certificate_key /etc/ssl/private/liger/privkey.pem;
    
    location / {
        proxy_pass http://liger_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /health {
        access_log off;
        proxy_pass http://liger_api/health;
    }
}
```

---

## 7. Monitoring & Maintenance

### 7.1 Health Checks

#### Application Health Endpoints:

```typescript
// Health check implementation
@Get('/health')
async healthCheck(): Promise<HealthCheckResult> {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version,
    services: {
      database: await this.checkDatabase(),
      redis: await this.checkRedis(),
      blockchain: await this.checkBlockchain()
    }
  };
}
```

#### Kubernetes Health Checks:

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3001
  initialDelaySeconds: 30
  periodSeconds: 10
  
readinessProbe:
  httpGet:
    path: /ready
    port: 3001
  initialDelaySeconds: 5
  periodSeconds: 5
```

### 7.2 Monitoring Setup

#### Prometheus Configuration:

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'liger-services'
    static_configs:
      - targets: ['proposal-svc:3001', 'approval-svc:3002']
    metrics_path: /metrics
    scrape_interval: 10s
```

#### Grafana Dashboards:

```json
{
  "dashboard": {
    "title": "LIGER Platform Metrics",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])"
          }
        ]
      }
    ]
  }
}
```

### 7.3 Log Management

#### Centralized Logging with ELK Stack:

```yaml
# docker-compose.logging.yml
version: '3.8'
services:
  elasticsearch:
    image: elasticsearch:7.14.0
    environment:
      - discovery.type=single-node
    ports:
      - "9200:9200"

  logstash:
    image: logstash:7.14.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf

  kibana:
    image: kibana:7.14.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
```

### 7.4 Backup & Recovery

#### Database Backup Script:

```bash
#!/bin/bash
# backup-database.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgres"
DB_NAME="liger_prod"

# Create backup directory
mkdir -p $BACKUP_DIR

# Perform backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME | gzip > $BACKUP_DIR/liger_backup_$DATE.sql.gz

# Clean old backups (keep 7 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: liger_backup_$DATE.sql.gz"
```

#### Automated Backup Schedule:

```bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /opt/liger/scripts/backup-database.sh >> /var/log/liger-backup.log 2>&1
```

---

## 8. Troubleshooting

### 8.1 Common Issues

#### Service Startup Issues:

**Problem**: Service fails to start with port binding error
```bash
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution**:
```bash
# Check what's using the port
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or use different port
export PROPOSAL_SVC_PORT=3011
```

#### Database Connection Issues:

**Problem**: Cannot connect to PostgreSQL database
```bash
Error: getaddrinfo ENOTFOUND postgres
```

**Solutions**:
```bash
# Check database service status
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Test connection manually
psql -h localhost -p 5432 -U postgres -d liger_dev
```

#### Memory Issues:

**Problem**: Node.js processes running out of memory
```bash
FATAL ERROR: Ineffective mark-compacts near heap limit
```

**Solution**:
```bash
# Increase Node.js heap size
export NODE_OPTIONS="--max_old_space_size=4096"

# Or in package.json
"scripts": {
  "start": "node --max_old_space_size=4096 dist/main.js"
}
```

### 8.2 Performance Optimization

#### Database Optimization:

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_proposals_student_id ON investment_proposals(student_id);
CREATE INDEX idx_proposals_status ON investment_proposals(status);
CREATE INDEX idx_credibility_scores_student_domain ON credibility_scores(student_id, domain);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM investment_proposals WHERE student_id = 'uuid';
```

#### Redis Optimization:

```bash
# Redis configuration
redis-cli CONFIG SET maxmemory 2gb
redis-cli CONFIG SET maxmemory-policy allkeys-lru

# Monitor Redis performance
redis-cli INFO memory
redis-cli MONITOR
```

### 8.3 Security Hardening

#### Server Hardening:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Configure firewall
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

# Setup fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

#### Application Security:

```bash
# Run security audit
npm audit
npm audit fix

# Update dependencies
npm update

# Check for vulnerabilities with Snyk
npx snyk test
```

### 8.4 Recovery Procedures

#### Service Recovery:

```bash
# Restart individual service
./liger.sh services:restart proposal-svc

# Restart all services
./liger.sh services:restart

# Check service health
./liger.sh monitor:health
```

#### Database Recovery:

```bash
# Restore from backup
gunzip -c /backups/postgres/liger_backup_20251001_020000.sql.gz | psql -h localhost -U postgres -d liger_prod

# Verify data integrity
psql -h localhost -U postgres -d liger_prod -c "SELECT COUNT(*) FROM students;"
```

#### Disaster Recovery:

```bash
# Complete system restoration
1. Provision new infrastructure
2. Restore database from backup
3. Deploy latest application version
4. Update DNS records
5. Verify all services are running
6. Run integration tests
```

---

## Conclusion

This deployment manual provides comprehensive guidance for deploying and maintaining the LIGER platform across different environments. Follow the procedures step-by-step and ensure all prerequisites are met before proceeding with production deployment.

For additional support:
- **Documentation**: `/docs/ARCHITECTURE.md` and `/docs/USER_GUIDE.md`
- **Issues**: Create GitHub issues for bugs and feature requests
- **Monitoring**: Use the provided monitoring stack for real-time insights

**Remember**: Always test deployments in staging environment before production rollouts.