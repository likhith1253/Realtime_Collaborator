# Real-Time Collaborative Document Editor with AI Assistance

## Project Overview

This project is a real-time collaborative document editing platform that integrates an AI assistant to help users generate and edit content. It was built using a microservices architecture to separate concerns, improve scalability, and allow different technologies to be used where they are most appropriate. 

The core feature is the collaborative editor, which allows multiple users to join a document room and see each other's changes in real-time, similar to Google Docs. The AI assistant can be invoked within the editor to provide context-aware text generation and summarization using a large language model.

## System Architecture

The application is structured around a Next.js frontend and a Node.js API Gateway that routes traffic to several backend microservices. The AI service is written in Python to leverage machine learning libraries natively. 

### Frontend
- **Web App (Next.js):** The client-facing application built with React and Tailwind CSS. It handles user authentication state, project management UI, and the real-time editor interface.

### Backend Microservices
All microservices sit behind the API Gateway, which handles routing and CORS. 

1. **API Gateway (Node.js/Express):** Acts as the single entry point for all client requests. It proxies HTTP requests to the appropriate downstream service and handles global error responses if a service is unavailable.
2. **Auth Service (Node.js/Express):** Manages user registration, login, and JWT (JSON Web Token) issuance. It connects to a PostgreSQL database to store user credentials securely.
3. **Organization Service (Node.js/Express):** Handles the creation and management of user organizations, teams, and projects. It is designed to support role-based access control and future billing integrations.
4. **Document Service (Node.js/Express):** Manages the metadata for documents, such as titles, ownership, and organization relationships.
5. **Collab Service (Node.js/Socket.io/Yjs):** The real-time synchronization engine. It uses WebSockets to maintain active connections with multiple clients in the same document room, broadcasting changes and managing presence (online users).
6. **AI Service (Python/FastAPI):** A dedicated service for natural language processing tasks. It integrates with the Google Gemini API to process user prompts alongside the current document context, providing intelligent text insertions and replacements.

## Technologies Used

- **Frontend:** Next.js, React, Tailwind CSS, Lucide Icons, Socket.io-client
- **Backend (Node.js):** Express, Prisma (ORM), Socket.io, Yjs (CRDTs for conflict resolution), JSON Web Tokens (JWT)
- **Backend (Python):** FastAPI, Pydantic, Google Generative AI SDK
- **Database:** PostgreSQL (managed on Render)
- **Hosting/Deployment:** Vercel (Frontend), Render (Backend Services and Database)

## Setup and Installation

### Prerequisites
- Node.js (v18 or higher)
- Python (3.9 or higher)
- PostgreSQL database
- Google Gemini API Key

### Local Development

1. Clone the repository.
2. Navigate to the `services/` directory and set up each backend service:
   - For Node.js services (`auth-service`, `api-gateway`, `collab-service`, `document-service`, `organization-service`), run `npm install`.
   - Create a `.env` file in each folder matching the `.env.example` templates. Provide your database connection string and JWT secrets.
   - Run `npx prisma db push` in the Node services to initialize the database schema.
   - Start each service using `npm run dev`.
3. Set up the Python AI Service:
   - Navigate to `services/ai-service`.
   - Install dependencies: `pip install -r requirements.txt`.
   - Create a `.env` file and provide your `GEMINI_API_KEY`.
   - Start the service: `python src/main.py`.
4. Set up the Frontend:
   - Navigate to `apps/web`.
   - Run `npm install`.
   - Create a `.env.local` file and specify the API Gateway URL (`NEXT_PUBLIC_API_URL=http://localhost:8000`).
   - Start the frontend: `npm run dev`.

The application will be accessible at `http://localhost:3000`.

## Challenges and Learnings

Building a real-time collaborative editor introduced significant challenges regarding state synchronization. Initially, implementing WebSockets cleanly across a microservices barrier and ensuring that rapid successive edits did not overwrite each other required careful tuning of debounce functions and the adoption of CRDTs (Conflict-free Replicated Data Types). 

Another challenge was managing the deployment of multiple interdependent services on free cloud tiers (Render), which presented issues with "cold starts" where services would time out after entering sleep mode. This was mitigated by implementing robust fallback error handling and graceful startup configurations.

## Future Work

- **Stripe Billing Integration:** The foundation for subscription billing has been laid in the Organization Service, but the frontend Stripe checkout flow needs to be completed to accept payments.
- **Advanced AI Formatting:** Expanding the AI service to return rich text formatting instead of just plain text.
- **Offline Support:** Implementing local caching so users can continue editing without an internet connection, syncing changes once they reconnect.
