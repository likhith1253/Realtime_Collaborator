"use strict";
/**
 * Authentication Middleware
 * Validates JWT tokens and enforces scope-based access control
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireScope = requireScope;
exports.auth = auth;
const jwt_1 = require("../utils/jwt");
const errors_1 = require("../utils/errors");
/**
 * Middleware to require a valid JWT token
 * Attaches decoded user to request.user
 */
function requireAuth(req, res, next) {
    const token = (0, jwt_1.extractBearerToken)(req.headers.authorization);
    if (!token) {
        throw new errors_1.UnauthorizedError('Authentication required', 'AUTH_REQUIRED');
    }
    // Verify token and attach user to request
    const decoded = (0, jwt_1.verifyAccessToken)(token);
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
function requireScope(requiredScope) {
    return (req, res, next) => {
        // Ensure user is authenticated first
        if (!req.user) {
            throw new errors_1.UnauthorizedError('Authentication required', 'AUTH_REQUIRED');
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
function auth(requiredScope) {
    return [requireAuth, requireScope(requiredScope)];
}
