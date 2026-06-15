import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
// @ts-ignore - Local module resolution
import { createLogger } from '@packages/logger';
import { healthCheck } from './health';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/error.middleware';
import { getPrismaClient, disconnectPrisma, initializeDatabase, checkDatabaseHealth } from '@collab/database';
import { seedDemoWorkspace } from './utils/demo-seeder';

const logger = createLogger('auth-service');
console.log('Auth Service: Starting execution...');
logger.info('Auth Service: Logger initialized');

const app = express();
const prisma = getPrismaClient();

// Trust proxy - Required for Render/Vercel to get correct client IP
// This allows Express to trust the X-Forwarded-* headers set by Render's proxy
app.set('trust proxy', true);

import { resolveClientIp } from './middleware/rate-limit.middleware';

// Pre-Middleware Logger - Log every single request hitting the server with detailed diagnostics
app.use((req, res, next) => {
    const requestId = Math.random().toString(36).substring(7);
    const timestamp = new Date().toISOString();
    const reqIp = req.ip;
    const forwardedFor = req.headers['x-forwarded-for'];
    const forwarded = req.headers['x-forwarded'];
    const realIp = req.headers['x-real-ip'];
    const originalClientIp = req.headers['x-original-client-ip'];
    const resolvedIp = resolveClientIp(req);
    
    logger.info(`[Incoming] RequestID: ${requestId} | Time: ${timestamp} | Method: ${req.method} | URL: ${req.url} | ResolvedIP: ${resolvedIp} | X-Original-Client-IP: ${originalClientIp} | X-Forwarded-For: ${forwardedFor} | req.ip: ${reqIp} | X-Real-IP: ${realIp}`);
    
    // Attach request ID to request for tracking
    (req as any).requestId = requestId;
    (req as any).resolvedClientIp = resolvedIp;
    next();
});

app.use(cors({
    origin: true,
    credentials: true,
}));

app.use(express.json());
app.use(morgan('combined'));

app.get('/health', (req, res) => {
    void healthCheck(req, res);
});

app.get('/ready', async (req, res) => {
    const db = await checkDatabaseHealth();
    const isReady = db.ok;
    res.status(isReady ? 200 : 503).json({ 
        status: isReady ? 'ready' : 'not_ready', 
        service: 'auth-service',
        database: isReady ? 'connected' : 'disconnected',
        redis: 'not_configured',
        version: '0.1.0',
        uptime: process.uptime()
    });
});

app.get('/live', (req, res) => {
    res.status(200).json({ 
        status: 'live', 
        service: 'auth-service',
        redis: 'not_configured',
        version: '0.1.0',
        uptime: process.uptime()
    });
});

app.get('/test-debug', (req, res) => {
    res.status(200).send('SERVER_IS_UPDATED_AND_WORKING');
});

// Mount routes at root - gateway handles /auth prefix
app.use('/', authRoutes);
app.use(errorHandler);

const startServer = async () => {
    const dbStatus = await initializeDatabase('auth-service');

    if (!dbStatus.connected) {
        logger.error(`Failed to start server: ${dbStatus.error}`);
        process.exit(1);
    }

    // Run deployment reset/seed for Demo workspace on startup
    try {
        await seedDemoWorkspace(prisma);
    } catch (err: any) {
        logger.error(`Failed to run demo workspace startup seeding: ${err.message}`);
    }

    app.listen(config.port, () => {
        logger.info(`Auth Service running on port ${config.port}`);
        logger.info(`Environment: ${config.nodeEnv}`);
        logger.info(`Auth Service Base URL: http://localhost:${config.port}/auth`);
        logger.info(`Database host: ${dbStatus.host}:${dbStatus.port}`);
        logger.info(`Applied migrations: ${dbStatus.appliedMigrations}`);

        if (authRoutes.stack) {
            logger.info('Registered Auth Routes:');
            authRoutes.stack.forEach((r: any) => {
                if (r.route && r.route.path) {
                    const methods = Object.keys(r.route.methods).join(', ').toUpperCase();
                    logger.info(`- ${methods} /auth${r.route.path}`);
                }
            });
        }
    });
};

const shutdown = async () => {
    logger.info('Shutting down gracefully...');
    await disconnectPrisma();
    process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

startServer();
