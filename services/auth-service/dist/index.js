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
const demo_seeder_1 = require("./utils/demo-seeder");
const logger = (0, logger_1.createLogger)('auth-service');
console.log('Auth Service: Starting execution...');
logger.info('Auth Service: Logger initialized');
const app = (0, express_1.default)();
const prisma = (0, database_1.getPrismaClient)();
// Trust proxy - Required for Render/Vercel to get correct client IP
// This allows Express to trust the X-Forwarded-* headers set by Render's proxy
app.set('trust proxy', true);
const rate_limit_middleware_1 = require("./middleware/rate-limit.middleware");
// Pre-Middleware Logger - Log every single request hitting the server with detailed diagnostics
app.use((req, res, next) => {
    const requestId = Math.random().toString(36).substring(7);
    const timestamp = new Date().toISOString();
    const reqIp = req.ip;
    const forwardedFor = req.headers['x-forwarded-for'];
    const forwarded = req.headers['x-forwarded'];
    const realIp = req.headers['x-real-ip'];
    const originalClientIp = req.headers['x-original-client-ip'];
    const resolvedIp = (0, rate_limit_middleware_1.resolveClientIp)(req);
    logger.info(`[Incoming] RequestID: ${requestId} | Time: ${timestamp} | Method: ${req.method} | URL: ${req.url} | ResolvedIP: ${resolvedIp} | X-Original-Client-IP: ${originalClientIp} | X-Forwarded-For: ${forwardedFor} | req.ip: ${reqIp} | X-Real-IP: ${realIp}`);
    // Attach request ID to request for tracking
    req.requestId = requestId;
    req.resolvedClientIp = resolvedIp;
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
app.get('/ready', async (req, res) => {
    const db = await (0, database_1.checkDatabaseHealth)();
    const isReady = db.ok;
    res.status(isReady ? 200 : 503).json({
        status: isReady ? 'ready' : 'not_ready',
        service: 'auth-service',
        database: isReady ? 'connected' : 'disconnected',
        redis: 'not_configured',
        version: '0.1.0',
        uptime: process.uptime()
    });
});
app.get('/live', (req, res) => {
    res.status(200).json({
        status: 'live',
        service: 'auth-service',
        redis: 'not_configured',
        version: '0.1.0',
        uptime: process.uptime()
    });
});
app.get('/test-debug', (req, res) => {
    res.status(200).send('SERVER_IS_UPDATED_AND_WORKING');
});
// Mount routes at root - gateway handles /auth prefix
app.use('/', auth_routes_1.default);
app.use(error_middleware_1.errorHandler);
const startServer = async () => {
    const dbStatus = await (0, database_1.initializeDatabase)('auth-service');
    if (!dbStatus.connected) {
        logger.error(`Failed to start server: ${dbStatus.error}`);
        process.exit(1);
    }
    // Run deployment reset/seed for Demo workspace on startup
    try {
        await (0, demo_seeder_1.seedDemoWorkspace)(prisma);
    }
    catch (err) {
        logger.error(`Failed to run demo workspace startup seeding: ${err.message}`);
    }
    app.listen(config_1.config.port, () => {
        logger.info(`Auth Service running on port ${config_1.config.port}`);
        logger.info(`Environment: ${config_1.config.nodeEnv}`);
        logger.info(`Auth Service Base URL: http://localhost:${config_1.config.port}/auth`);
        logger.info(`Database host: ${dbStatus.host}:${dbStatus.port}`);
        logger.info(`Applied migrations: ${dbStatus.appliedMigrations}`);
        if (auth_routes_1.default.stack) {
            logger.info('Registered Auth Routes:');
            auth_routes_1.default.stack.forEach((r) => {
                if (r.route && r.route.path) {
                    const methods = Object.keys(r.route.methods).join(', ').toUpperCase();
                    logger.info(`- ${methods} /auth${r.route.path}`);
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
