/**
 * Document Service Entry Point
 * Handles document, project, and organization CRUD operations (non-realtime)
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { PrismaClient } from '@collab/database';
import { config } from './config';
import { logger } from './logger';
import { healthCheck } from './health';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';

// Initialize Prisma Client
const prisma = new PrismaClient();

const app = express();

// Security middleware
app.use(helmet());
const allowedOrigins = [
    process.env.CORS_ORIGIN,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3004',
    'http://localhost:3005'
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));


// Request parsing
app.use(express.json());

// Request logging
app.use(morgan('combined'));

// Health check endpoint (no auth required)
app.get('/health', healthCheck);

// Mount API routes
app.use('/', routes);

// Error handling middleware (must be last)
app.use(errorHandler);

/**
 * Graceful shutdown handler
 * Disconnects Prisma client on process termination
 */
async function gracefulShutdown(signal: string) {
    logger.info(`${signal} received. Shutting down gracefully...`);
    await prisma.$disconnect();
    process.exit(0);
}

// Register shutdown handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

/**
 * Start the server
 */
const startServer = async () => {
    try {
        // Verify database connection
        await prisma.$connect();
        logger.info('Connected to database');

        app.listen(config.port, () => {
            logger.info(`Document Service running on port ${config.port}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

startServer();
