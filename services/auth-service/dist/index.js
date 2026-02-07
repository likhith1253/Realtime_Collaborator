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
const app = (0, express_1.default)();
const prisma = (0, database_1.getPrismaClient)();
// Security middleware - temporarily disabled for debugging
// app.use(helmet());
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://localhost:3004'],
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
        logger.info('Connecting to database...');
        await prisma.$connect();
        logger.info('Database connection established.');
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
        logger.error('Failed to start server:', error);
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
