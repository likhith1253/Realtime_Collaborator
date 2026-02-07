import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3004,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwt: {
        secret: process.env.JWT_SECRET || 'access-secret-fallback',
    },
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
};
