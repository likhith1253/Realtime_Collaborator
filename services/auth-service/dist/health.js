"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheck = void 0;
const database_1 = require("@collab/database");
const healthCheck = async (req, res) => {
    const db = await (0, database_1.checkDatabaseHealth)();
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
exports.healthCheck = healthCheck;
