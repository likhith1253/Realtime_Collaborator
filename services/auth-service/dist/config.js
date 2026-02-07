"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production',
        expiresIn: '15m', // Access token: 15 minutes
        refreshExpiresIn: '7d' // Refresh token: 7 days
    },
    // Bcrypt Configuration
    bcrypt: {
        saltRounds: 12
    }
};
