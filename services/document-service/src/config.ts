/**
 * Document Service Configuration
 * Centralizes all environment variables and configuration settings
 */

import dotenv from 'dotenv';
import path from 'path';

// Ensure .env is loaded from the document-service folder regardless of CWD
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
    if (!value && defaultValue === undefined) {
        console.warn(`⚠️ Warning: Missing environment variable: ${key}`);
        return '';
    }
    return value || '';
};

export const config = {
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
