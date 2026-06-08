import dotenv from 'dotenv';
import path from 'path';

// Ensure .env is loaded from the organization-service folder regardless of CWD
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
    port: process.env.PORT || 3004,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwt: {
        secret: getEnv('JWT_SECRET'),
    },
    clientUrl: getEnv('CLIENT_URL'),
    databaseUrl: getEnv('DATABASE_URL'),
    stripeSecretKey: getEnv('STRIPE_SECRET_KEY'),
    stripeWebhookSecret: getEnv('STRIPE_WEBHOOK_SECRET'),
};
