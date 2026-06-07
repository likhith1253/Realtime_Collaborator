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
import { getPrismaClient, disconnectPrisma } from '@collab/database';

const logger = createLogger('auth-service');
console.log('Auth Service: Starting execution...');
logger.info('Auth Service: Logger initialized');

const app = express();
const prisma = getPrismaClient();

// Pre-Middleware Logger - Log every single request hitting the server
app.use((req, res, next) => {
    logger.info(`[Incoming] ${req.method} ${req.url} from ${req.ip}`);
    next();
});

// Security middleware - temporarily disabled for debugging
// app.use(helmet());
app.use(cors({
    origin: true,
    credentials: true,
}));

// Body parsing
app.use(express.json());

// Request logging
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', healthCheck);

// Debug endpoint to verify server update
app.get('/test-debug', (req, res) => {
    res.status(200).send('SERVER_IS_UPDATED_AND_WORKING');
});

// CORS test endpoint
app.options('/auth/login', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(200).send();
});

app.post('/auth/test-cors', (req, res) => {
    console.log('[TEST] CORS test request received:', req.body);
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(200).json({ message: 'CORS test successful', received: req.body });
});

const BASE_PATH = '/auth';

// Auth routes - mounted at /auth as per API contract
app.use(BASE_PATH, authRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

const startServer = async () => {
    try {
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            logger.error('CRITICAL: DATABASE_URL is not defined! Service cannot start.');
            process.exit(1);
        }

        // Log the host portion for debugging (mask password only)
        try {
            const parsed = new URL(dbUrl);
            logger.info(`[DB] Host: ${parsed.hostname}:${parsed.port || 5432}`);
            logger.info(`[DB] Database: ${parsed.pathname}`);
            logger.info(`[DB] SSL mode in URL: ${parsed.searchParams.get('sslmode') || '(none)'}`);
            logger.info(`[DB] User: ${parsed.username}`);
        } catch (urlErr) {
            logger.warn(`[DB] Could not parse DATABASE_URL for logging: ${urlErr}`);
        }

        // Render PostgreSQL requires SSL — append sslmode=require if not present
        if (!dbUrl.includes('sslmode') && process.env.NODE_ENV === 'production') {
            const separator = dbUrl.includes('?') ? '&' : '?';
            process.env.DATABASE_URL = `${dbUrl}${separator}sslmode=require`;
            logger.info('[DB] Appended ?sslmode=require for Render PostgreSQL.');
        }

        logger.info('[DB] Connecting to database (timeout: 30s)...');

        // Allow 30s for cold-start DB on Render free tier
        const connectionPromise = prisma.$connect();
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Database connection timed out after 30000ms')), 30000)
        );

        await Promise.race([connectionPromise, timeoutPromise]);

        logger.info('[DB] Connection established successfully.');

        app.listen(config.port, () => {
            logger.info(`Auth Service running on port ${config.port}`);
            logger.info(`Environment: ${config.nodeEnv}`);
            logger.info(`Auth Service Base URL: http://localhost:${config.port}${BASE_PATH}`);

            // Temporary: Log registered routes for verification
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
    } catch (error: any) {
        logger.error(`Failed to start server: ${error.message}`);
        logger.error(error.stack);
        // We exit with 1 to let Render restart the service
        process.exit(1);
    }
};

// Graceful shutdown handler
const shutdown = async () => {
    logger.info('Shutting down gracefully...');
    await disconnectPrisma();
    process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

startServer();
