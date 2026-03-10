import dotenv from 'dotenv';

dotenv.config();

const sanitizeUrl = (url: string) => {
    if (!url) return url;
    // Remove trailing slashes
    let sanitized = url.trim().replace(/\/+$/, '');
    // If it's a public render URL, ensure it starts with https
    if (sanitized.includes('onrender.com') && !sanitized.startsWith('http')) {
        sanitized = `https://${sanitized}`;
    }
    return sanitized;
};

export const config = {
    port: process.env.PORT || 8000,
    services: {
        auth: {
            url: sanitizeUrl(process.env.AUTH_SERVICE_URL || 'http://127.0.0.1:3001'),
        },
        org: {
            url: sanitizeUrl(process.env.ORG_SERVICE_URL || 'http://127.0.0.1:3004'),
        },
        docs: {
            url: sanitizeUrl(process.env.DOCS_SERVICE_URL || 'http://127.0.0.1:3002'),
        },
        collab: {
            url: sanitizeUrl(process.env.COLLAB_SERVICE_URL || 'http://127.0.0.1:3003'),
        },
        ai: {
            url: sanitizeUrl(process.env.AI_SERVICE_URL || 'http://127.0.0.1:8001'),
        }
    },
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Web App
    }
};
