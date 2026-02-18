import dotenv from 'dotenv';
import path from 'path';

// Ensure .env is loaded from the organization-service folder regardless of CWD
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const getEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`❌ Missing required environment variable: ${key}`);
    }
    return value;
};

export const config = {
    port: process.env.PORT || 3004,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwt: {
        secret: getEnv('JWT_SECRET'),
    },
    clientUrl: getEnv('CLIENT_URL'), // Usually same as CORS_ORIGIN or FRONTEND_URL
    databaseUrl: getEnv('DATABASE_URL'),
    stripeSecretKey: getEnv('STRIPE_SECRET_KEY')
};
