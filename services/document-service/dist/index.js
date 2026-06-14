"use strict";
/**
 * Document Service Entry Point
 * Handles document, project, and organization CRUD operations (non-realtime)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const database_1 = require("@collab/database");
const config_1 = require("./config");
const logger_1 = require("./logger");
const health_1 = require("./health");
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middleware/error.middleware");
// Initialize Prisma Client
const prisma = (0, database_1.getPrismaClient)();
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
const allowedOrigins = [
    process.env.CORS_ORIGIN,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3004',
    'http://localhost:3005'
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: true, // Reflect request origin allowed - Gateway handles actual security
    credentials: true,
}));
// Request parsing
app.use(express_1.default.json());
// Request logging
app.use((0, morgan_1.default)('combined'));
// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
    void (0, health_1.healthCheck)(req, res);
});
// Mount API routes
app.use('/', routes_1.default);
// Error handling middleware (must be last)
app.use(error_middleware_1.errorHandler);
/**
 * Graceful shutdown handler
 * Disconnects Prisma client on process termination
 */
async function gracefulShutdown(signal) {
    logger_1.logger.info(`${signal} received. Shutting down gracefully...`);
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
        const dbStatus = await (0, database_1.initializeDatabase)('document-service');
        if (!dbStatus.connected) {
            logger_1.logger.error('Failed to start server:', dbStatus.error);
            process.exit(1);
        }
        app.listen(config_1.config.port, () => {
            logger_1.logger.info(`Document Service running on port ${config_1.config.port}`);
            logger_1.logger.info(`Database host: ${dbStatus.host}:${dbStatus.port}`);
            logger_1.logger.info('Registered routes: /projects, /documents, /presentations, /slides, /canvas, /invites, /organizations');
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
};
startServer();
