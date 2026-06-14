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
    req.requestId = requestId;
    next();
});
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, morgan_1.default)('combined'));
app.get('/health', (req, res) => {
    void (0, health_1.healthCheck)(req, res);
});
app.get('/test-debug', (req, res) => {
    res.status(200).send('SERVER_IS_UPDATED_AND_WORKING');
});
const BASE_PATH = '/auth';
app.use(BASE_PATH, auth_routes_1.default);
app.use(error_middleware_1.errorHandler);
const startServer = async () => {
    const dbStatus = await (0, database_1.initializeDatabase)('auth-service');
    if (!dbStatus.connected) {
        logger.error(`Failed to start server: ${dbStatus.error}`);
        process.exit(1);
    }
    app.listen(config_1.config.port, () => {
        logger.info(`Auth Service running on port ${config_1.config.port}`);
        logger.info(`Environment: ${config_1.config.nodeEnv}`);
        logger.info(`Auth Service Base URL: http://localhost:${config_1.config.port}${BASE_PATH}`);
        logger.info(`Database host: ${dbStatus.host}:${dbStatus.port}`);
        logger.info(`Applied migrations: ${dbStatus.appliedMigrations}`);
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
};
const shutdown = async () => {
    logger.info('Shutting down gracefully...');
    await (0, database_1.disconnectPrisma)();
    process.exit(0);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
startServer();
