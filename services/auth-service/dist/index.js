"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("./config");
// @ts-ignore - Local module resolution
const logger_1 = require("@packages/logger");
const health_1 = require("./health");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const database_1 = require("@collab/database");
const logger = (0, logger_1.createLogger)('auth-service');
console.log('Auth Service: Starting execution...');
logger.info('Auth Service: Logger initialized');
const app = (0, express_1.default)();
const prisma = (0, database_1.getPrismaClient)();
// Pre-Middleware Logger - Log every single request hitting the server
app.use((req, res, next) => {
    logger.info(`[Incoming] ${req.method} ${req.url} from ${req.ip}`);
    next();
});
// Security middleware - temporarily disabled for debugging
// app.use(helmet());
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
// Body parsing
app.use(express_1.default.json());
// Request logging
app.use((0, morgan_1.default)('combined'));
// Health check endpoint
app.get('/health', health_1.healthCheck);
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
app.use(BASE_PATH, auth_routes_1.default);
// Error handling middleware (must be last)
app.use(error_middleware_1.errorHandler);
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
        }
        catch (urlErr) {
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
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Database connection timed out after 30000ms')), 30000));
        await Promise.race([connectionPromise, timeoutPromise]);
        logger.info('[DB] Connection established successfully.');
        app.listen(config_1.config.port, () => {
            logger.info(`Auth Service running on port ${config_1.config.port}`);
            logger.info(`Environment: ${config_1.config.nodeEnv}`);
            logger.info(`Auth Service Base URL: http://localhost:${config_1.config.port}${BASE_PATH}`);
            // Temporary: Log registered routes for verification
            if (auth_routes_1.default.stack) {
                logger.info('Registered Auth Routes:');
                auth_routes_1.default.stack.forEach((r) => {
                    if (r.route && r.route.path) {
                        const methods = Object.keys(r.route.methods).join(', ').toUpperCase();
                        logger.info(`- ${methods} ${BASE_PATH}${r.route.path}`);
                    }
                });
            }
        });
    }
    catch (error) {
        logger.error(`Failed to start server: ${error.message}`);
        logger.error(error.stack);
        // We exit with 1 to let Render restart the service
        process.exit(1);
    }
};
// Graceful shutdown handler
const shutdown = async () => {
    logger.info('Shutting down gracefully...');
    await (0, database_1.disconnectPrisma)();
    process.exit(0);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
startServer();
