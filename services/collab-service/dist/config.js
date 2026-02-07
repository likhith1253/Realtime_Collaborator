"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 3003,
    nodeEnv: process.env.NODE_ENV || 'development',
    // JWT Configuration (must match auth-service for token verification)
    jwt: {
        secret: process.env.JWT_SECRET || 'access-secret-fallback'
    },
    // Persistence Configuration
    persistence: {
        // Debounce delay for saving Yjs state to database (in ms)
        saveDebounceMs: 1500
    }
};
