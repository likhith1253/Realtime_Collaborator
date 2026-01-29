"use strict";
/**
 * JWT Utility Functions for Document Service
 * Handles token verification for incoming requests
 * Note: Token generation happens in auth-service; this service only verifies
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = verifyAccessToken;
exports.extractBearerToken = extractBearerToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const errors_1 = require("./errors");
/**
 * Verify and decode an access token
 * @throws InvalidTokenError if token is invalid or expired
 */
function verifyAccessToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
        return decoded;
    }
    catch (error) {
        throw new errors_1.InvalidTokenError();
    }
}
/**
 * Extract Bearer token from Authorization header
 * @returns token string or null if not present/invalid format
 */
function extractBearerToken(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
}
