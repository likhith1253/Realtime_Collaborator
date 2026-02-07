/**
 * Collaboration Service Entry Point
 * WebSocket server for real-time document collaboration using Yjs
 * 
 * Responsibilities:
 * - Socket.io server with JWT authentication
 * - Yjs document synchronization
 * - User presence/awareness
 * - Persistence to PostgreSQL (debounced)
 */

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { logger } from './logger';
import { healthCheck } from './health';
import { verifyAccessToken, extractTokenFromHandshake } from './utils/jwt';
import { AuthenticationError } from './utils/AppErrors';
import * as collabHandler from './handlers/collab.handler';

// ============================================================================
// Express App Setup
// ============================================================================

const app = express();
const server = http.createServer(app);

// ============================================================================
// Socket.io Server Setup
// ============================================================================

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    },
    // Allow both WebSocket and polling transports
    transports: ['websocket', 'polling']
});

// ============================================================================
// Middleware
// ============================================================================

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// ============================================================================
// Routes
// ============================================================================

app.get('/health', healthCheck);

// ============================================================================
// Socket.io Authentication Middleware
// ============================================================================

/**
 * JWT Authentication Middleware for Socket.io
 * Verifies token on connection and attaches user data to socket
 */
io.use((socket, next) => {
    try {
        // Extract token from handshake
        const token = extractTokenFromHandshake(socket.handshake);

        if (!token) {
            logger.warn(`Connection rejected: No token provided (socket: ${socket.id})`);
            return next(new AuthenticationError('Authentication required'));
        }

        // Verify token
        const decoded = verifyAccessToken(token);

        // Register socket with user data
        collabHandler.registerSocket(socket, decoded);

        logger.info(`User authenticated: ${decoded.email} (socket: ${socket.id})`);
        next();
    } catch (error) {
        if (error instanceof AuthenticationError) {
            logger.warn(`Connection rejected: ${error.message} (socket: ${socket.id})`);
            next(error);
        } else {
            logger.error('Unexpected authentication error:', error);
            next(new AuthenticationError('Authentication failed'));
        }
    }
});

// ============================================================================
// Socket.io Connection Handler
// ============================================================================

io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // Setup collaboration event handlers
    collabHandler.setupSocketHandlers(io, socket);

    // Handle errors
    socket.on('error', (error) => {
        logger.error(`Socket error (${socket.id}):`, error);
    });
});

// ============================================================================
// Server Startup
// ============================================================================

const startServer = async () => {
    try {
        server.listen(config.port, () => {
            logger.info(`Collab Service (Socket.io) running on port ${config.port}`);
            logger.info(`Environment: ${config.nodeEnv}`);
            logger.info(`WebSocket path: /socket.io`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// ============================================================================
// Graceful Shutdown
// ============================================================================

const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);

    // Stop accepting new connections
    server.close(() => {
        logger.info('HTTP server closed');
    });

    // Close all Socket.io connections
    io.close(() => {
        logger.info('Socket.io server closed');
    });

    // Save pending documents and cleanup
    await collabHandler.shutdown();

    logger.info('Graceful shutdown complete');
    process.exit(0);
};

// Handle shutdown signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    shutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the server
startServer();
