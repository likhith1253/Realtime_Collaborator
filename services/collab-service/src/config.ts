import dotenv from 'dotenv';
import path from 'path';

// Ensure .env is loaded from the collab-service folder regardless of CWD
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
    port: process.env.PORT || 3003,
    nodeEnv: process.env.NODE_ENV || 'development',

    // JWT Configuration (must match auth-service for token verification)
    jwt: {
        secret: getEnv('JWT_SECRET')
    },

    // Persistence Configuration
    persistence: {
        // Debounce delay for saving Yjs state to database (in ms)
        saveDebounceMs: 1500
    },

    // Database Configuration
    databaseUrl: getEnv('DATABASE_URL')
};
