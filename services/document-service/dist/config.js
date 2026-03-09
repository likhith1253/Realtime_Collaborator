"use strict";
/**
 * Document Service Configuration
 * Centralizes all environment variables and configuration settings
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Ensure .env is loaded from the document-service folder regardless of CWD
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const getEnv = (key, defaultValue) => {
    const value = process.env[key] || defaultValue;
    if (!value && defaultValue === undefined) {
        console.warn(`⚠️ Warning: Missing environment variable: ${key}`);
        return '';
    }
    return value || '';
};
exports.config = {
    port: process.env.PORT || 3002,
    nodeEnv: process.env.NODE_ENV || 'development',
    // JWT Configuration - must match auth-service for token verification
    jwt: {
        secret: getEnv('JWT_SECRET')
    },
    // Database Configuration
    databaseUrl: getEnv('DATABASE_URL'),
    // Email Configuration
    email: {
        host: getEnv('SMTP_HOST'),
        port: parseInt(getEnv('SMTP_PORT'), 10),
        user: getEnv('SMTP_USER'),
        pass: getEnv('SMTP_PASS'),
        secure: process.env.SMTP_SECURE === 'true',
        from: getEnv('SMTP_FROM')
    },
    // Frontend URL for links in emails
    frontendUrl: getEnv('FRONTEND_URL')
};
