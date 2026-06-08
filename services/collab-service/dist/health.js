"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheck = void 0;
const database_1 = require("@collab/database");
const healthCheck = async (req, res) => {
    const db = await (0, database_1.checkDatabaseHealth)();
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
exports.healthCheck = healthCheck;
