console.log('API Gateway: Starting execution...');

import express from 'express';
console.log('API Gateway: Imports loaded (express)');
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { config } from './config';
console.log('API Gateway: Config loaded');
// @ts-ignore - Local module resolution
import { createLogger } from '@packages/logger';

console.log('API Gateway: Creating app...');
const app = express();
const logger = createLogger('api-gateway');

// Connectivity Check Function
const checkServiceHealth = async (name: string, url: string) => {
    try {
        logger.info(`Checking health of ${name} at ${url}/health...`);
        const response = await fetch(`${url}/health`);
        if (response.ok) {
            logger.info(`✅ Connectivity Check: ${name} is UP (${response.status})`);
        } else {
            logger.warn(`⚠️ Connectivity Check: ${name} returned ${response.status}`);
        }
    } catch (error: any) {
        logger.error(`❌ Connectivity Check: ${name} is DOWN. Error: ${error.message}`);
    }
};
console.log('API Gateway: Logger created');

// Middleware
app.use(helmet());
app.use(cors({
    origin: config.cors.origin,
    credentials: true
}));
app.use(morgan('dev'));

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'api-gateway' });
});

// Debug Network Endpoint - EXPOSE INTERNAL CONNECTIVITY STATE TO USER
// Debug Network Endpoint - EXPOSE INTERNAL CONNECTIVITY STATE TO USER
// Debug Network Endpoint - EXPOSE INTERNAL CONNECTIVITY STATE TO USER
app.get('/debug-network', async (req, res) => {
    const services = [
        { key: 'auth', name: 'Auth Service', url: config.services.auth.url },
        { key: 'org', name: 'Org Service', url: config.services.org.url },
        { key: 'collab', name: 'Collab Service', url: config.services.collab.url },
        { key: 'docs', name: 'Docs Service', url: config.services.docs.url },
        { key: 'ai', name: 'AI Service', url: config.services.ai.url },
    ];

    const results: any = {
        config: {
            authUrl: config.services.auth.url,
            orgUrl: config.services.org.url,
            collabUrl: config.services.collab.url,
            docsUrl: config.services.docs.url,
            aiUrl: config.services.ai.url,
        },
        tests: {}
    };

    // Run connection tests in parallel with a short timeout
    await Promise.all(services.map(async (svc) => {
        try {
            const start = Date.now();
            const healthUrl = `${svc.url}/health`;

            // 3 second timeout using AbortController
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            try {
                const response = await fetch(healthUrl, { signal: controller.signal });
                const duration = Date.now() - start;
                results.tests[svc.key] = {
                    name: svc.name,
                    url: svc.url,
                    status: response.ok ? 'UP' : 'WARN',
                    httpStatus: response.status,
                    durationMs: duration,
                    statusText: response.statusText
                };
            } finally {
                clearTimeout(timeoutId);
            }
        } catch (error: any) {
            results.tests[svc.key] = {
                name: svc.name,
                url: svc.url,
                status: 'DOWN',
                error: error.name === 'AbortError' ? 'Timeout (3000ms)' : error.message,
                code: error.cause?.code || 'UNKNOWN'
            };
        }
    }));

    res.json(results);
});

// AI Service Proxy
app.use('/ai', createProxyMiddleware({
    target: config.services.ai.url,
    changeOrigin: true,
    // Do not rewrite path, the AI service expects /ai/chat
    onProxyReq: (proxyReq, req, res) => {
        logger.info(`Proxying AI Request: ${req.method} ${req.originalUrl} -> ${config.services.ai.url}`);
    },
    onError: (err, req, res) => {
        logger.error(`AI Proxy Error: ${err.message}`);
        res.status(502).json({ error: 'Bad Gateway', message: 'AI Service unavailable' });
    }
} as any) as unknown as express.RequestHandler);

// Auth Service Proxy
app.use('/auth', createProxyMiddleware({
    // Target must include /auth if express strips it and backend expects it
    target: `${config.services.auth.url}/auth`,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        logger.info(`Proxying Auth Request: ${req.method} ${req.originalUrl} -> ${config.services.auth.url}/auth`);
    },
    onError: (err, req, res) => {
        logger.error(`Auth Proxy Error: ${err.message}`);
        res.status(502).json({ error: 'Bad Gateway', message: 'Auth Service unavailable' });
    }
} as any) as unknown as express.RequestHandler);


// Org Service Proxy
app.use('/orgs', createProxyMiddleware({
    target: config.services.org.url,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        logger.info(`Proxying Org Request: ${req.method} ${req.originalUrl} -> ${config.services.org.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
        // Remove CORS headers from backend response - let gateway handle CORS
        delete proxyRes.headers['access-control-allow-origin'];
        delete proxyRes.headers['access-control-allow-credentials'];
        delete proxyRes.headers['access-control-allow-methods'];
        delete proxyRes.headers['access-control-allow-headers'];
    },
    onError: (err, req, res) => {
        logger.error(`Org Proxy Error: ${err.message}`);
        res.status(502).json({ error: 'Bad Gateway', message: 'Org Service unavailable' });
    }
} as any) as unknown as express.RequestHandler);

// Document Service Proxy (Projects & Documents)
// Document Service Proxy - Projects
const projectsProxy = createProxyMiddleware({
    target: `${config.services.docs.url}/projects`,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        logger.info(`Proxying Projects Request: ${req.method} ${req.path} -> ${config.services.docs.url}/projects`);
    },
    onProxyRes: (proxyRes, req, res) => {
        delete proxyRes.headers['access-control-allow-origin'];
        delete proxyRes.headers['access-control-allow-credentials'];
    },
    onError: (err, req, res) => {
        logger.error(`Projects Proxy Error: ${err.message}`);
        res.status(502).json({ error: 'Bad Gateway', message: 'Document Service unavailable' });
    }
} as any) as unknown as express.RequestHandler;

// Document Service Proxy - Documents
const documentsProxy = createProxyMiddleware({
    target: `${config.services.docs.url}/documents`,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        logger.info(`Proxying Documents Request: ${req.method} ${req.path} -> ${config.services.docs.url}/documents`);
    },
    onProxyRes: (proxyRes, req, res) => {
        delete proxyRes.headers['access-control-allow-origin'];
        delete proxyRes.headers['access-control-allow-credentials'];
    },
    onError: (err, req, res) => {
        logger.error(`Documents Proxy Error: ${err.message}`);
        res.status(502).json({ error: 'Bad Gateway', message: 'Document Service unavailable' });
    }
} as any) as unknown as express.RequestHandler;

// Document Service Proxy - Slides
const slidesProxy = createProxyMiddleware({
    target: `${config.services.docs.url}/slides`,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        logger.info(`Proxying Slides Request: ${req.method} ${req.path} -> ${config.services.docs.url}/slides`);
    },
    onError: (err, req, res) => {
        logger.error(`Slides Proxy Error: ${err.message}`);
        res.status(502).json({ error: 'Bad Gateway', message: 'Document Service unavailable' });
    }
} as any) as unknown as express.RequestHandler;

// Billing Service Proxy
app.use('/billing', createProxyMiddleware({
    target: `${config.services.org.url}/billing`,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        logger.info(`Proxying Billing Request: ${req.method} ${req.originalUrl} -> ${config.services.org.url}/billing`);
    },
    onError: (err, req, res) => {
        logger.error(`Billing Proxy Error: ${err.message}`);
        res.status(502).json({ error: 'Bad Gateway', message: 'Billing Service unavailable' });
    }
} as any) as unknown as express.RequestHandler);

// Billing Service Proxy
app.use('/billing', createProxyMiddleware({
    target: `${config.services.org.url}/billing`, // Route to organization service
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        logger.info(`Proxying Billing Request: ${req.method} ${req.originalUrl} -> ${config.services.org.url}/billing`);
    },
    onError: (err, req, res) => {
        logger.error(`Billing Proxy Error: ${err.message}`);
        res.status(502).json({ error: 'Bad Gateway', message: 'Billing Service unavailable' });
    }
} as any) as unknown as express.RequestHandler);

// Document Service Proxy - Canvas
const canvasProxy = createProxyMiddleware({
    target: `${config.services.docs.url}`,
    changeOrigin: true,
    pathRewrite: {
        '^/canvas/projects': '/projects', // Rewrite canvas/projects to projects
        '^/canvas/canvas': '/canvas',     // Rewrite canvas/canvas to canvas  
        '^/canvas': '/canvas'             // Fallback for other canvas routes
    },
});

app.use('/projects', projectsProxy);
app.use('/documents', documentsProxy);
app.use('/slides', slidesProxy);
app.use('/canvas', canvasProxy);

// Add error handling for canvas routes that return HTML
app.use('/canvas/*', (req, res, next) => {
    // If we get here, the canvas proxy didn't handle the request
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: 'Canvas endpoint not found'
        }
    });
});

// Document Service Proxy - Invites
app.use('/invites', createProxyMiddleware({
    target: config.services.docs.url,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        logger.info(`Proxying Invites Request: ${req.method} ${req.originalUrl} -> ${config.services.docs.url}`);
    },
    onError: (err, req, res) => {
        logger.error(`Invites Proxy Error: ${err.message}`);
        res.status(502).json({ error: 'Bad Gateway', message: 'Document Service unavailable' });
    }
} as any) as unknown as express.RequestHandler);

// Document Service Proxy - Presentations
app.use('/presentations', createProxyMiddleware({
    target: `${config.services.docs.url}/presentations`,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        logger.info(`Proxying Presentations Request: ${req.method} ${req.path} -> ${config.services.docs.url}/presentations`);
    },
    onError: (err, req, res) => {
        logger.error(`Presentations Proxy Error: ${err.message}`);
        res.status(502).json({ error: 'Bad Gateway', message: 'Document Service unavailable' });
    }
} as any) as unknown as express.RequestHandler);

// Collab Service Proxy (e.g. for potential HTTP endpoints, though mostly socket.io)
app.use('/collab', createProxyMiddleware({
    target: config.services.collab?.url || 'http://localhost:3003',
    changeOrigin: true,
} as any) as unknown as express.RequestHandler);

// Socket.io Proxy
app.use('/socket.io', createProxyMiddleware({
    target: config.services.collab?.url || 'http://localhost:3003',
    changeOrigin: true,
    ws: true,
    onProxyReq: (proxyReq, req, res) => {
        // Log only initial handshake to avoid spam
        if (!req.url.includes('transport=websocket')) {
            logger.info(`Proxying Socket.io: ${req.url}`);
        }
    },
    onError: (err, req, res) => {
        logger.error(`Socket Proxy Error: ${err.message}`);
        // Socket errors can't always send a json response if connection is upgraded
    }
} as any) as unknown as express.RequestHandler);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(`Gateway Error: ${err.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
app.listen(config.port, () => {
    logger.info(`API Gateway running on port ${config.port}`);
    logger.info(`Proxying /auth -> ${config.services.auth.url}`);
    logger.info(`Proxying /orgs -> ${config.services.org.url}`);
    logger.info(`Proxying /collab -> ${config.services.collab.url}`);
    logger.info(`Proxying /ai -> ${config.services.ai.url}`);
    logger.info(`Proxying /documents -> ${config.services.docs.url}`);

    // Perform initial connectivity checks
    checkServiceHealth('Auth Service', config.services.auth.url);
    checkServiceHealth('Org Service', config.services.org.url);
});
