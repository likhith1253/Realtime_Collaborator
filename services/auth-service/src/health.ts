import { Request, Response } from 'express';
import { checkDatabaseHealth } from '@collab/database';

export const healthCheck = async (req: Request, res: Response) => {
    const db = await checkDatabaseHealth();
    const databaseStatus = db.ok ? 'connected' : 'disconnected';
    const redisStatus = 'not_configured'; // Redis is not used in the stack

    const isOk = db.ok;

    res.status(isOk ? 200 : 503).json({
        status: isOk ? 'ok' : 'degraded',
        service: 'auth-service',
        database: databaseStatus,
        redis: redisStatus,
        version: '0.1.0',
        uptime: process.uptime(),
        ...(db.error ? { error: db.error } : {})
    });
};
