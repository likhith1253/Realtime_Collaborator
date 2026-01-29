# PHASED EXECUTION PLAN
## AI-Integrated Real-Time Content Collaboration Platform

> **SOURCE OF TRUTH**: `docs/00-canonical-system-spec.md`
> **STATUS**: EXECUTABLE
> **VIOLATION CHECK**: Verified against Section 10 constraints.

---

## PHASE A: FOUNDATION SETUP
**Objective**: Establish repository structure, DevOps baseline, and local development environment.

1.  **Repo Initialization**
    *   **Input**: Empty directory.
    *   **Action**: Initialize Git, create `.gitignore`, setup monorepo structure (Turborepo or simple folders).
    *   **Structure**: `/apps/web`, `/services/auth`, `/services/document`, `/services/collab`, `/services/ai`.
    *   **Output**: Committed repo structure.
    *   **Status**: BLOCKING.

2.  **Infrastructure as Code (Local)**
    *   **Input**: Docker requirement.
    *   **Action**: Create `docker-compose.yml` for infrastructure only.
    *   **Services**: PostgreSQL 15, Redis 7, Elasticsearch 8 (optional for now), MinIO (S3 mock).
    *   **Output**: Running containers for DB/Cache.
    *   **Status**: BLOCKING.

3.  **Database Baseline**
    *   **Input**: PostgreSQL running.
    *   **Action**: Initialize Prisma in `/packages/database` (shared lib).
    *   **Action**: Define `User`, `Organization`, `Project`, `Document` basic schemas.
    *   **Action**: Run initial migration.
    *   **Output**: `schema.prisma`, generated client.
    *   **Status**: BLOCKING.

4.  **Shared Libraries**
    *   **Input**: TypeScript config.
    *   **Action**: Create `/packages/types` (Shared Zod schemas/Interfaces).
    *   **Action**: Create `/packages/logger` (Winston/Pino wrapper).
    *   **Output**: NPM packages linked in monorepo.
    *   **Status**: NON-BLOCKING.

---

## PHASE B: CONTROL PLANE (AUTH & ORG)
**Objective**: Enable user sign-up, login, and organization management.

1.  **Auth Service Setup**
    *   **Service**: `auth-service`
    *   **Input**: Express boilerplate.
    *   **Action**: Implement `POST /auth/register`, `POST /auth/login`.
    *   **Action**: Implement JWT signing (Access + Refresh strategy).
    *   **Output**: Functional Auth endpoints.
    *   **Status**: BLOCKING.

2.  **API Gateway Config (Initial)**
    *   **Service**: Gateway (Kong/Nginx or Custom Node Proxy).
    *   **Action**: Route `/api/v1/auth/*` to Auth Service.
    *   **Action**: Implement JWT validation middleware at gateway level.
    *   **Output**: Secured entry point.
    *   **Status**: BLOCKING.

3.  **Organization Management**
    *   **Service**: `document-service` (acting as core API).
    *   **Action**: Implement `POST /organizations`, `GET /organizations`.
    *   **Action**: Implement `POST /projects` (linked to Org).
    *   **Output**: Ability to create orgs and projects.
    *   **Status**: BLOCKING.

4.  **Frontend Auth Integration**
    *   **Service**: `web-app` (Next.js).
    *   **Action**: Setup NextAuth or custom provider.
    *   **Action**: Build Login/Register pages.
    *   **Action**: Build Dashboard (list projects).
    *   **Output**: UI for logging in and viewing projects.
    *   **Status**: BLOCKING.

---

## PHASE C: DOCUMENT CORE (NON-REALTIME)
**Objective**: Basic CRUD for documents without real-time collaboration.

1.  **Document CRUD API**
    *   **Service**: `document-service`.
    *   **Action**: Implement `POST /documents`.
    *   **Action**: Implement `GET /documents/:id` (fetch content).
    *   **Action**: Implement `PUT /documents/:id` (snapshot save).
    *   **Output**: API to create and retrieve docs.
    *   **Status**: BLOCKING.

2.  **Frontend Editor (Reference)**
    *   **Service**: `web-app`.
    *   **Action**: Install TipTap.
    *   **Action**: Create `EditorComponent`.
    *   **Action**: Wire Load/Save to `document-service` APIs (JSON content).
    *   **Output**: Working single-user editor.
    *   **Status**: BLOCKING.

3.  **Version History Schema**
    *   **Service**: `document-service` + DB.
    *   **Action**: Create `document_versions` table.
    *   **Action**: Implement manual "Save Version" logic.
    *   **Output**: Versioning backend support.
    *   **Status**: NON-BLOCKING.

---

## PHASE D: REAL-TIME COLLABORATION
**Objective**: Enable multiplayer editing with Yjs.

1.  **Collaboration Service Scaffold**
    *   **Service**: `collab-service` (Socket.io).
    *   **Action**: Setup WebSocket server.
    *   **Action**: Implement JWT Auth handshake.
    *   **Output**: Secure WS endpoint.
    *   **Status**: BLOCKING.

2.  **Yjs Backend Integration**
    *   **Service**: `collab-service`.
    *   **Action**: Implement `y-websocket` server-side logic.
    *   **Action**: Implement `join-document` room logic.
    *   **Action**: Implement Persistence (Load Ydoc from PG -> Memory -> Save back on debounce).
    *   **Output**: Stateful rooms.
    *   **Dependencies**: Phase C (DB Schema).
    *   **Status**: BLOCKING.

3.  **Frontend Yjs Wiring**
    *   **Service**: `web-app`.
    *   **Action**: Add `yjs`, `y-websocket`, `y-prosemirror`.
    *   **Action**: Connect Editor to WS URL.
    *   **Output**: Multi-tab synchronization working.
    *   **Status**: BLOCKING.

4.  **Presence & Awareness**
    *   **Service**: `collab-service` + `web-app`.
    *   **Action**: Implement Awareness protocol (User coloring, cursory positions).
    *   **Action**: Broadcast user list.
    *   **Output**: "User X is typing..." indicators.
    *   **Status**: NON-BLOCKING.

---

## PHASE E: AI INTEGRATION
**Objective**: Enable generative features.

1.  **AI Service Setup**
    *   **Service**: `ai-service` (FastAPI).
    *   **Action**: Setup FastAPI with Pydantic models.
    *   **Action**: Configure OpenAI/Anthropic/Gemini clients.
    *   **Output**: Standalone Python service.
    *   **Status**: BLOCKING.

2.  **Prompt Engineering & Router**
    *   **Service**: `ai-service`.
    *   **Action**: Implement `POST /generate`.
    *   **Action**: Implement Context Builder (truncation logic).
    *   **Action**: Implement Model Router (Gemini Fast vs GPT-4o).
    *   **Output**: API capable of returning text.
    *   **Status**: BLOCKING.

3.  **Frontend AI UI**
    *   **Service**: `web-app`.
    *   **Action**: Create "Ask AI" floating menu / sidebar.
    *   **Action**: Wire API calls to Gateway -> AI Service.
    *   **Action**: Handle streaming responses (if implemented) or loading states.
    *   **Output**: UI for interacting with AI.
    *   **Status**: BLOCKING.

4.  **Async Queue (Optional/Pro)**
    *   **Service**: `ai-service` + Redis.
    *   **Action**: Setup Celery for long-running tasks.
    *   **Output**: Robust handling of large context requests.
    *   **Status**: NON-BLOCKING.

---

## PHASE F: EXPORTS, SEARCH, ANALYTICS
**Objective**: Polish and utility features.

1.  **Export Service**
    *   **Service**: `export-service` (Node).
    *   **Action**: Implement `YDoc -> Markdown` converter.
    *   **Action**: Implement `YDoc -> PDF` (Puppeteer/PDFKit).
    *   **Output**: Downloadable files.
    *   **Status**: NON-BLOCKING.

2.  **Search Indexing**
    *   **Service**: `search-service` + `document-service`.
    *   **Action**: Add hook on Document Save -> Push to Elasticsearch.
    *   **Action**: Implement `/search` endpoint in Gateway.
    *   **Output**: Full-text search capability.
    *   **Status**: NON-BLOCKING.

---

## PHASE G: HARDENING & DEPLOYMENT
**Objective**: Production readiness.

1.  **CI/CD Pipeline**
    *   **Action**: GitHub Actions for Build & Test.
    *   **Action**: Docker Image building.
    *   **Status**: BLOCKING.

2.  **Security Audit**
    *   **Action**: Rate Limit tuning (Redis).
    *   **Action**: Vulnerability scan.
    *   **Status**: BLOCKING.

3.  **Monitoring**
    *   **Action**: Setup Prometheus/Grafana.
    *   **Action**: Add health checks to all services.
    *   **Status**: BLOCKING.
