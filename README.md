# Real-Time Collaborative Document Editor

<p align="center">
  <em>A powerful, real-time collaboration platform designed for seamless document editing, enriched with AI-assisted content generation.</em>
</p>

<p align="center">
  <a href="#key-features"><strong>Features</strong></a> ·
  <a href="#system-architecture"><strong>Architecture</strong></a> ·
  <a href="#quick-start"><strong>Quick Start</strong></a> ·
  <a href="#technology-stack"><strong>Tech Stack</strong></a>
</p>

---

## 📖 Overview

Built on a modern microservices architecture, this application solves the problem of disconnected workflows by merging live multi-user synchronization, intelligent AI writing tools, and team organization into a single cohesive workspace.

**Live Deployment:** *[Insert Production URL Here]*

---

## ✨ Key Features

- ⚡ **Real-Time Collaboration:** Sub-millisecond latent document synchronization powered by WebSockets and CRDTs (Yjs).
- 🤖 **AI-Powered Assistance:** Context-aware text generation, summarization, and autocomplete using Google Gemini.
- 🔒 **Secure Workspace Management:** strict Role-Based Access Control (RBAC) inside Organizations and Projects.
- 💾 **Robust Persistence:** Immutable document version histories backing up real-time memory states.
- 🚀 **Scalable Infrastructure:** Microservices deployment ensuring single points of failure do not cascade across the domain.

---

## 🏗️ System Architecture

Our distributed architecture routes all client communication through a central API Gateway into specialized microservices, isolating concerns such as real-time sync, authentication, document storage, and AI processing.

<p align="center">
  <img src="docs/images/architecture_diagram.md" alt="Architecture Diagram" />
</p>

> **Note:** Detailed sequence diagrams and component breakdowns are available in the [`docs/`](docs/) directory.

---

## 💻 Visual Tour

| Home Dashboard | Editor Interface | Payment Gateway |
|:---:|:---:|:---:|
| ![Dashboard](docs/images/screenshot_home.png) | ![Editor](docs/images/editor_view.png) | ![Payment Gateway](docs/images/payment_page.png) |

---

## 🛠️ Technology Stack

| Ecosystem | Primary Technologies |
|---|---|
| **Frontend** | Next.js, React, Tailwind CSS, Lucide Icons |
| **Backend & APIs** | Node.js, Express, Socket.io, Yjs |
| **AI Service** | Python, FastAPI, Google Generative AI (Gemini) SDK |
| **Database & ORM** | PostgreSQL, Prisma |
| **Hosting & Deployment**| Vercel (Frontend), Render (Backend Services and Database) |

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (3.9+)
- **PostgreSQL** Database 
- **Google Gemini API Key**

### 2. Environment Setup
To run the full stack, populate `.env` files in each respective directory based on their `.env.example`.
- `DATABASE_URL`: PostgreSQL connection string (Org, Auth, Doc services).
- `JWT_SECRET`: Secure encryption key for verifying tokens.
- `GEMINI_API_KEY`: Required by the Python AI Service.

### 3. Installation & Running

**A. Backend Hub**
Initialize databases and start the core Node.js services.
```bash
cd services/
npx prisma db push 
npm run dev
```

**B. AI Processing Service**
Boot the FastAPI Python service handling Gemini LLM requests.
```bash
cd services/ai-service
pip install -r requirements.txt
python src/main.py
```

**C. Web Client**
Start the Next.js frontend application.
```bash
cd apps/web
npm install
npm run dev
```
Navigate to `http://localhost:3000` to preview.

---

## 📂 Repository Structure

The codebase is organized as a monorepo containing distinct applications and services:

```text
Realtime_Collaborator/
├── apps/web/                  # Next.js Frontend
│
├── services/                  # Backend microservices
│   ├── api-gateway/           # Central router proxy
│   ├── auth-service/          # JWT Authentication
│   ├── collab-service/        # Socket.io & Yjs sync
│   ├── document-service/      # Metadata & Snapshots
│   ├── organization-service/  # Tenant & Billing logic
│   └── ai-service/            # Python FastAPI 
│
├── packages/                  # Shared libraries
│   ├── database/              # Prisma Schema & migrations
│   ├── logger/                # Global logging
│   └── types/                 # Shared TS definitions
│
└── docs/                      # Engineering documentation
```

---

## 🔮 Future Roadmap

- **Stripe Frontend Integration:** The backend Stripe integration endpoints are already built into the `organization-service`. The next step is building the frontend UI Checkout session component to connect with these endpoints.
- **Offline-First Editing:** Utilize IndexedDB to persist local Yjs vectors while offline, merging gracefully upon internet reconnection.
- **Rich Text AI:** Advancing the AI service to construct heavily formatted blocks recursively (headings, lists, inline styling) natively bypassing plain text.

---

## 🌍 Impact Statement

*Realtime_Collaborator* pushes the boundary of modern SaaS architectures by blending cutting-edge AI utility with complex, conflict-free, peer-to-peer data syncing. This repository functions as a production-grade template demonstrating scalable state management and microservice architecture suitable for high-performance productivity tools.