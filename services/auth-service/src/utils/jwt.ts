import jwt from 'jsonwebtoken';
import { RefreshTokenSchema } from '@packages/types';

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'access-secret-fallback';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret-fallback';

const EXPIRES_IN = '15m'; // Short-lived access token
const REFRESH_EXPIRES_IN = '7d'; // Long-lived refresh token

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
    organizationId: string;
}

export const signAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: EXPIRES_IN });
};

export const signRefreshToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
    } catch (error) {
        return null;
    }
};

export const verifyRefreshToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
    } catch (error) {
        return null;
    }
};
