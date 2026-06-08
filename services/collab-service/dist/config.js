"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Ensure .env is loaded from the collab-service folder regardless of CWD
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
    port: process.env.PORT || 3003,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwt: {
        secret: getEnv('JWT_SECRET'),
    },
    persistence: {
        saveDebounceMs: 1500,
    },
    databaseUrl: getEnv('DATABASE_URL'),
};
