/**
 * Authentication Middleware
 * Validates JWT tokens and enforces scope-based access control
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractBearerToken, DecodedToken } from '../utils/jwt';
import { UnauthorizedError, InsufficientScopeError } from '../utils/errors';

// Extend Express Request to include authenticated user
declare global {
    namespace Express {
        interface Request {
            user?: DecodedToken;
        }
    }
}

/**
 * Middleware to require a valid JWT token
 * Attaches decoded user to request.user
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
        throw new UnauthorizedError('Authentication required', 'AUTH_REQUIRED');
    }

    // Verify token and attach user to request
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
}

/**
 * Middleware factory to require specific scopes
 * For MVP, we're implementing a permissive scope check.
 * In production, scopes would be embedded in the JWT by auth-service
 * 
 * @param requiredScope - The scope required to access this endpoint
 */
export function requireScope(requiredScope: string) {
    return (req: Request, res: Response, next: NextFunction): void => {
        // Ensure user is authenticated first
        if (!req.user) {
            throw new UnauthorizedError('Authentication required', 'AUTH_REQUIRED');
        }

        // For MVP: Allow all authenticated users to perform actions.
        // In production, check req.user.scopes includes requiredScope
        // 
        // Example production implementation:
        // const userScopes = req.user.scopes || [];
        // if (!userScopes.includes(requiredScope)) {
        //     throw new InsufficientScopeError(requiredScope);
        // }

        next();
    };
}

/**
 * Combined auth middleware that validates token and checks scope
 * @param requiredScope - The scope required to access this endpoint
 */
export function auth(requiredScope: string) {
    return [requireAuth, requireScope(requiredScope)];
}
