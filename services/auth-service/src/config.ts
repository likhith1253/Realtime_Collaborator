import dotenv from 'dotenv';
import path from 'path';

// Ensure .env is loaded from the auth-service folder regardless of CWD
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const getEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`❌ Missing required environment variable: ${key}`);
    }
    return value;
};

export const config = {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',

    // JWT Configuration
    jwt: {
        secret: getEnv('JWT_SECRET'),
        refreshSecret: getEnv('JWT_REFRESH_SECRET'),
        expiresIn: '15m' as const,      // Access token: 15 minutes
        refreshExpiresIn: '7d' as const // Refresh token: 7 days
    },

    // Database Configuration
    databaseUrl: getEnv('DATABASE_URL'),

    // CORS Configuration
    corsOrigin: getEnv('CORS_ORIGIN'),

    // Bcrypt Configuration
    bcrypt: {
        saltRounds: 12
    }
};
