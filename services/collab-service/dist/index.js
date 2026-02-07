"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("./config");
const logger_1 = require("./logger");
const health_1 = require("./health");
const jwt_1 = require("./utils/jwt");
const AppErrors_1 = require("./utils/AppErrors");
const collabHandler = __importStar(require("./handlers/collab.handler"));
// ============================================================================
// Express App Setup
// ============================================================================
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// ============================================================================
// Socket.io Server Setup
// ============================================================================
const io = new socket_io_1.Server(server, {
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
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('combined'));
// ============================================================================
// Routes
// ============================================================================
app.get('/health', health_1.healthCheck);
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
        const token = (0, jwt_1.extractTokenFromHandshake)(socket.handshake);
        if (!token) {
            logger_1.logger.warn(`Connection rejected: No token provided (socket: ${socket.id})`);
            return next(new AppErrors_1.AuthenticationError('Authentication required'));
        }
        // Verify token
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        // Register socket with user data
        collabHandler.registerSocket(socket, decoded);
        logger_1.logger.info(`User authenticated: ${decoded.email} (socket: ${socket.id})`);
        next();
    }
    catch (error) {
        if (error instanceof AppErrors_1.AuthenticationError) {
            logger_1.logger.warn(`Connection rejected: ${error.message} (socket: ${socket.id})`);
            next(error);
        }
        else {
            logger_1.logger.error('Unexpected authentication error:', error);
            next(new AppErrors_1.AuthenticationError('Authentication failed'));
        }
    }
});
// ============================================================================
// Socket.io Connection Handler
// ============================================================================
io.on('connection', (socket) => {
    logger_1.logger.info(`Client connected: ${socket.id}`);
    // Setup collaboration event handlers
    collabHandler.setupSocketHandlers(io, socket);
    // Handle errors
    socket.on('error', (error) => {
        logger_1.logger.error(`Socket error (${socket.id}):`, error);
    });
});
// ============================================================================
// Server Startup
// ============================================================================
const startServer = async () => {
    try {
        server.listen(config_1.config.port, () => {
            logger_1.logger.info(`Collab Service (Socket.io) running on port ${config_1.config.port}`);
            logger_1.logger.info(`Environment: ${config_1.config.nodeEnv}`);
            logger_1.logger.info(`WebSocket path: /socket.io`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
};
// ============================================================================
// Graceful Shutdown
// ============================================================================
const shutdown = async (signal) => {
    logger_1.logger.info(`Received ${signal}. Starting graceful shutdown...`);
    // Stop accepting new connections
    server.close(() => {
        logger_1.logger.info('HTTP server closed');
    });
    // Close all Socket.io connections
    io.close(() => {
        logger_1.logger.info('Socket.io server closed');
    });
    // Save pending documents and cleanup
    await collabHandler.shutdown();
    logger_1.logger.info('Graceful shutdown complete');
    process.exit(0);
};
// Handle shutdown signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
// Handle uncaught errors
process.on('uncaughtException', (error) => {
    logger_1.logger.error('Uncaught Exception:', error);
    shutdown('uncaughtException');
});
process.on('unhandledRejection', (reason, promise) => {
    logger_1.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
// Start the server
startServer();
