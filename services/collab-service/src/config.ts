import dotenv from 'dotenv';
import path from 'path';

// Ensure .env is loaded from the collab-service folder regardless of CWD
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const isProduction = (process.env.NODE_ENV || 'development') === 'production';

const getEnv = (key: string, defaultValue?: string): string => {
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

export const config = {
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
