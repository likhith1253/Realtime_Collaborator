"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Ensure .env is loaded from the auth-service folder regardless of CWD
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const isProduction = (process.env.NODE_ENV || 'development') === 'production';
const getEnv = (key, defaultValue) => {
    const value = process.env[key] || defaultValue;
    if (!value && defaultValue === undefined) {
        if (isProduction) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
        console.warn(`Warning: Missing environment variable: ${key}`);
        return '';
    }
    return value || '';
};
exports.config = {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    // JWT Configuration
    jwt: {
        secret: getEnv('JWT_SECRET'),
        refreshSecret: getEnv('JWT_REFRESH_SECRET'),
        expiresIn: '15m',
        refreshExpiresIn: '7d',
    },
    // Database Configuration
    databaseUrl: getEnv('DATABASE_URL'),
    // CORS Configuration
    corsOrigin: getEnv('CORS_ORIGIN'),
    // Bcrypt Configuration
    bcrypt: {
        saltRounds: 12,
    },
};
