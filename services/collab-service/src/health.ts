import { Request, Response } from 'express';
import { checkDatabaseHealth } from '@collab/database';

export const healthCheck = async (req: Request, res: Response) => {
    const db = await checkDatabaseHealth();

    if (!db.ok) {
        res.status(503).json({
            status: 'degraded',
            service: 'collab-service',
            database: 'disconnected',
            error: db.error,
        });
        return;
    }

    res.status(200).json({ status: 'ok', service: 'collab-service', database: 'connected' });
};
