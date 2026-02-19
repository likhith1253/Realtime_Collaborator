import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
// @ts-ignore - Local module resolution
import { createLogger } from '@packages/logger';
import orgRoutes from './routes/org.routes';
import billingRoutes from './routes/billing.routes';

const logger = createLogger('organization-service');
const app = express();

app.use(helmet());
app.use(cors({
    origin: true, // Allow Gateway to handle CORS security
    credentials: true
}));
app.use(express.json());
app.use(morgan('combined'));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'organization-service' });
});

// Routes
app.use('/', orgRoutes);
app.use('/billing', billingRoutes);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const startServer = () => {
    app.listen(config.port, () => {
        logger.info(`Organization Service running on port ${config.port}`);
    });
};

startServer();
