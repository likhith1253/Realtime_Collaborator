# Setup & Installation Guide

This guide details configuring and staging the complete application cluster locally for development.

## Prerequisites
Ensure the following global dependencies are bound to your path:
- Node.js (v18 or higher)
- Python (3.9 or higher)
- PostgreSQL Database Instance (Running locally on port 5432 or remote deployment)
- API Keys: 
  - Google Gemini API Key

## 1. Local Database Environment

If you lack a local Postgres environment, standard Docker deployments can be spun up. A basic configuration is provided via `docker-compose.yml`.

Launch the database:
```bash
docker-compose up -d
```
Connection string: `postgresql://collab_user:collab_pass@localhost:5433/collab_db`

## 2. Shared Packages and Installation
Navigate to the root directory and install all node packages concurrently.
```bash
npm install # if using monorepo tasks, else install explicitly inside apps/web and services/*
```

## 3. Environment Variables Configuration

### `services/auth-service/.env`
```env
PORT=3001
DATABASE_URL="postgresql://collab_user:collab_pass@localhost:5433/collab_db"
JWT_SECRET="your_secure_development_jwt_secret"
NODE_ENV="development"
```

### `services/api-gateway/.env`
```env
PORT=8000
AUTH_SERVICE_URL="http://localhost:3001"
ORG_SERVICE_URL="http://localhost:3002"
COLLAB_SERVICE_URL="http://localhost:3003"
DOCS_SERVICE_URL="http://localhost:3004"
AI_SERVICE_URL="http://localhost:8001"
JWT_SECRET="your_secure_development_jwt_secret"
NODE_ENV="development"
```

### `services/organization-service/.env`
```env
PORT=3002
DATABASE_URL="postgresql://collab_user:collab_pass@localhost:5433/collab_db"
JWT_SECRET="your_secure_development_jwt_secret"
STRIPE_SECRET_KEY="sk_test_..."
# Webhooks not required for minimal dev
```

### `services/document-service/.env`
```env
PORT=3004
DATABASE_URL="postgresql://collab_user:collab_pass@localhost:5433/collab_db"
JWT_SECRET="your_secure_development_jwt_secret"
```

### `services/ai-service/.env`
```env
APP_NAME="AI Service"
PORT=8001
CORS_ORIGIN="*"
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
```

### `apps/web/.env.local`
```env
NEXT_PUBLIC_API_URL="http://localhost:8000"
```

## 4. Run Prisma Migrations

Deploy the schema architecture to your configured PostgreSQL instance. Execute inside your database package or node.js terminal pointing to prisma.
```bash
cd packages/database
npx prisma db push
# or npx prisma migrate dev
```

## 5. Starting the Cluster

Spin up the services in terminal windows:

**Node.js Services**
```bash
cd services/api-gateway && npm run dev
cd services/auth-service && npm run dev
cd services/organization-service && npm run dev
cd services/document-service && npm run dev
cd services/collab-service && npm run dev
```

**AI Service (Python)**
```bash
cd services/ai-service
pip install -r requirements.txt
python src/main.py
```

**Frontend (Next.js)**
```bash
cd apps/web
npm run dev
```

You are ready! Browse `http://localhost:3000`.
