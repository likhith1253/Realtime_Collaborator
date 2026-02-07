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

const app = express();
const prisma = getPrismaClient();

// Security middleware - temporarily disabled for debugging
// app.use(helmet());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3004'],
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
        logger.info('Connecting to database...');
        await prisma.$connect();
        logger.info('Database connection established.');

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
    } catch (error) {
        logger.error('Failed to start server:', error);
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
