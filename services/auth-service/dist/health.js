"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheck = void 0;
const database_1 = require("@collab/database");
const healthCheck = async (req, res) => {
    const db = await (0, database_1.checkDatabaseHealth)();
    if (!db.ok) {
        res.status(503).json({
            status: 'degraded',
            service: 'auth-service',
            database: 'disconnected',
            error: db.error,
        });
        return;
    }
    res.status(200).json({
        status: 'ok',
        service: 'auth-service',
        database: 'connected',
    });
};
exports.healthCheck = healthCheck;
