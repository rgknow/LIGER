# 🦁 LIGER Platform - Development Guide

## Quick Start

### 1. Database Setup
```bash
# Start PostgreSQL database
npm run dev:db

# Run migrations and seed data
npm run db:migrate
npm run db:seed

# Test database connection
npm test
```

### 2. Start Services

#### Core Services
```bash
# Start individual services
npm run dev:approval     # Port 3013/3014 - Parent approval workflow
npm run dev:risk        # Port 3015/3016 - Risk assessment  
npm run dev:notify      # Port 3017/3018 - Notifications
npm run dev:proposal    # Port 3003/3004 - Proposal management

# Or start all core services at once
npm run dev:all
```

#### Additional Services
```bash
npm run dev:gift        # Port 3019/3020 - Gift management
npm run dev:scholarship # Port 3005/3006 - Scholarships
npm run dev:loan        # Port 3007/3008 - P2P loans
npm run dev:dossier     # Port 3009/3010 - Student dossiers
```

### 3. Database Tools
```bash
npm run db:studio       # Open Prisma Studio (GUI)
npm run db:seed         # Re-seed with sample data
```

## Service Endpoints

### Approval Service (3014)
- `GET /proposals/pending` - Get pending proposals for parent review
- `GET /proposals/:id/brief` - Get detailed proposal brief
- `POST /proposals/:id/approve` - Approve proposal with digital signature
- `POST /proposals/:id/reject` - Reject proposal with feedback
- `POST /proposals/:id/revise` - Request revision with comments

### Risk Service (3016)  
- `POST /assess` - Assess proposal risk (returns Low/Medium/High)

### Notification Service (3018)
- `POST /send` - Send multi-channel notification

## Sample API Calls

### Test Risk Assessment
```bash
curl -X POST http://localhost:3016/assess \
  -H "Content-Type: application/json" \
  -d '{
    "vertical": "stocks",
    "amount": 100,
    "studentSCS": 75,
    "studentAge": 16
  }'
```

### Get Pending Proposals
```bash
curl http://localhost:3014/proposals/pending
```

### Send Notification
```bash
curl -X POST http://localhost:3018/send \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-parent-1",
    "type": "proposal_submitted",
    "title": "New Proposal",
    "body": "Your child submitted a new investment proposal",
    "channels": ["push", "email"]
  }'
```

## Database Schema

The platform uses PostgreSQL with Prisma ORM. Key models:

- **Student**: Student profiles with SCS and wallet balance
- **Proposal**: Investment proposals with approval workflow  
- **Approval**: Parent approval records with digital signatures
- **WalletTransaction**: CTK token movements and balance tracking
- **GiftEvent**: Birthday/celebration gift campaigns
- **Scholarship**: Global scholarship opportunities
- **LoanRequest**: P2P education loan requests
- **Dossier**: Verifiable student achievement records

## Architecture Patterns

### Microservice Communication
- **HTTP**: External API endpoints for frontend apps
- **TCP**: Internal service-to-service communication
- **Event Bus**: Planned NATS/Kafka integration for async events

### Security & Compliance
- **Parent Custody**: All transactions require parent approval
- **Digital Signatures**: Cryptographic approval records
- **Risk Gates**: High-risk proposals require 2FA + cooling-off periods
- **Audit Trails**: Complete blockchain-anchored transaction logs

### Data Flow
1. **Student** creates proposal → `proposal-svc`
2. **Risk Assessment** → `risk-svc` evaluates and classifies
3. **Parent Notification** → `notify-svc` sends alerts
4. **Parent Review** → `approval-svc` handles decision
5. **Execution** → Token bank processes approved transactions
6. **Anchoring** → `blockchain-svc` creates immutable records

## Development Tips

### Database Queries
Use Prisma Studio (`npm run db:studio`) to explore data visually.

### Service Debugging
Each service logs to console. Use `docker logs liger-postgres` for DB logs.

### Port Allocation
Services use consistent port patterns:
- TCP (internal): 3003, 3005, 3007, 3009, 3011, 3013, 3015, 3017...  
- HTTP (external): 3004, 3006, 3008, 3010, 3012, 3014, 3016, 3018...

### Environment Variables
Copy `.env.example` to `.env` and update with real API keys for:
- Firebase (push notifications)
- Stripe/PayPal (payments)  
- SendGrid (email)
- Twilio (SMS)
- Polygon/Infura (blockchain)

## Next Steps

1. **Frontend Development**: React Native Parent/Student apps
2. **Event Bus Integration**: NATS for async service communication
3. **Blockchain Integration**: Polygon testnet for anchoring
4. **Payment Integration**: Real payment gateway connections
5. **Authentication**: JWT-based auth service
6. **Testing**: Comprehensive test suite with Jest

The platform is designed for **global scalability** with compliance frameworks for multiple countries and educational systems.