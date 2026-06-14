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
import { getPrismaClient, disconnectPrisma, initializeDatabase } from '@collab/database';

const logger = createLogger('auth-service');
console.log('Auth Service: Starting execution...');
logger.info('Auth Service: Logger initialized');

const app = express();
const prisma = getPrismaClient();

// Trust proxy - Required for Render/Vercel to get correct client IP
// This allows Express to trust the X-Forwarded-* headers set by Render's proxy
app.set('trust proxy', true);

// Pre-Middleware Logger - Log every single request hitting the server with detailed diagnostics
app.use((req, res, next) => {
    const requestId = Math.random().toString(36).substring(7);
    const timestamp = new Date().toISOString();
    const clientIp = req.ip;
    const forwardedFor = req.headers['x-forwarded-for'];
    const forwarded = req.headers['x-forwarded'];
    const realIp = req.headers['x-real-ip'];
    
    logger.info(`[Incoming] RequestID: ${requestId} | Time: ${timestamp} | Method: ${req.method} | URL: ${req.url} | ClientIP: ${clientIp} | X-Forwarded-For: ${forwardedFor} | X-Forwarded: ${forwarded} | X-Real-IP: ${realIp}`);
    
    // Attach request ID to request for tracking
    (req as any).requestId = requestId;
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

app.get('/test-debug', (req, res) => {
    res.status(200).send('SERVER_IS_UPDATED_AND_WORKING');
});

const BASE_PATH = '/auth';
app.use(BASE_PATH, authRoutes);
app.use(errorHandler);

const startServer = async () => {
    const dbStatus = await initializeDatabase('auth-service');

    if (!dbStatus.connected) {
        logger.error(`Failed to start server: ${dbStatus.error}`);
        process.exit(1);
    }

    app.listen(config.port, () => {
        logger.info(`Auth Service running on port ${config.port}`);
        logger.info(`Environment: ${config.nodeEnv}`);
        logger.info(`Auth Service Base URL: http://localhost:${config.port}${BASE_PATH}`);
        logger.info(`Database host: ${dbStatus.host}:${dbStatus.port}`);
        logger.info(`Applied migrations: ${dbStatus.appliedMigrations}`);

        if (authRoutes.stack) {
            logger.info('Registered Auth Routes:');
            authRoutes.stack.forEach((r: any) => {
                if (r.route && r.route.path) {
                    const methods = Object.keys(r.route.methods).join(', ').toUpperCase();
                    logger.info(`- ${methods} ${BASE_PATH}${r.route.path}`);
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
