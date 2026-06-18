import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
// @ts-ignore - Local module resolution
import { createLogger } from '@packages/logger';
import orgRoutes from './routes/org.routes';
import billingRoutes from './routes/billing.routes';
import { initializeDatabase, checkDatabaseHealth, disconnectPrisma } from '@collab/database';

const logger = createLogger('organization-service');
const app = express();

app.use(helmet());
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(morgan('combined'));

app.get('/health', async (req, res) => {
    const db = await checkDatabaseHealth();
    if (!db.ok) {
        res.status(503).json({
            status: 'degraded',
            service: 'organization-service',
            database: 'disconnected',
            error: db.error,
        });
        return;
    }

    res.status(200).json({
        status: 'ok',
        service: 'organization-service',
        database: 'connected',
    });
});

app.use('/', orgRoutes);
app.use('/billing', billingRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(err.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
});

const startServer = async () => {
    const dbStatus = await initializeDatabase('organization-service');

    if (!dbStatus.connected) {
        logger.error(`Failed to start server: ${dbStatus.error}`);
        process.exit(1);
    }

    app.listen(config.port, () => {
        logger.info(`Organization Service running on port ${config.port}`);
        logger.info(`Database host: ${dbStatus.host}:${dbStatus.port}`);
        logger.info('Registered routes: POST /, GET /me, GET /:id, POST /:id/members, /billing/*');
    });
};

process.on('SIGTERM', async () => {
    await disconnectPrisma();
    process.exit(0);
});

startServer();


