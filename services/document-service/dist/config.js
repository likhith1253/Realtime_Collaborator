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
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 3002,
    nodeEnv: process.env.NODE_ENV || 'development',
    // JWT Configuration - must match auth-service for token verification
    jwt: {
        secret: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production'
    }
};
