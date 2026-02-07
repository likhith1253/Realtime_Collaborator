import dotenv from 'dotenv';
import path from 'path';

// Ensure .env is loaded from the auth-service folder regardless of CWD
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const config = {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',

    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production',
        expiresIn: '15m' as const,      // Access token: 15 minutes
        refreshExpiresIn: '7d' as const // Refresh token: 7 days
    },

    // Bcrypt Configuration
    bcrypt: {
        saltRounds: 12
    }
};
