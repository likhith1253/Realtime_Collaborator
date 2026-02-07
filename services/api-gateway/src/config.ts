import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 8000,
    services: {
        auth: {
            url: process.env.AUTH_SERVICE_URL || 'http://127.0.0.1:3001',
        },
        org: {
            url: process.env.ORG_SERVICE_URL || 'http://127.0.0.1:3004',
        },
        docs: {
            url: process.env.DOCS_SERVICE_URL || 'http://127.0.0.1:3002',
        },
        collab: {
            url: process.env.COLLAB_SERVICE_URL || 'http://127.0.0.1:3003',
        },
        ai: {
            url: process.env.AI_SERVICE_URL || 'http://127.0.0.1:8001',
        }
    },
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Web App
    }
};
