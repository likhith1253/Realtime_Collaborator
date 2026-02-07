/**
 * Document Service Configuration
 * Centralizes all environment variables and configuration settings
 */

import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3002,
    nodeEnv: process.env.NODE_ENV || 'development',

    // JWT Configuration - must match auth-service for token verification
    jwt: {
        secret: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production'
    }
};
