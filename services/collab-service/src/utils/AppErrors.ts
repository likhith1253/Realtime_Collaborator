/**
 * Custom Error Classes for Collab Service
 * Provides structured errors for WebSocket event handling
 */

/**
 * Base error class for Collab Service
 */
export class CollabError extends Error {
    public readonly code: string;

    constructor(message: string, code: string) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }

    /**
     * Convert to a plain object for sending over WebSocket
     */
    toJSON() {
        return {
            error: {
                code: this.code,
                message: this.message
            }
        };
    }
}

/**
 * Authentication Error
 * Thrown when JWT is missing, invalid, or expired
 */
export class AuthenticationError extends CollabError {
    constructor(message: string = 'Authentication failed') {
        super(message, 'AUTH_ERROR');
    }
}

/**
 * Document Not Found Error
 * Thrown when trying to join a non-existent document
 */
export class DocumentNotFoundError extends CollabError {
    constructor(docId: string) {
        super(`Document not found: ${docId}`, 'DOCUMENT_NOT_FOUND');
    }
}

/**
 * Access Denied Error
 * Thrown when user doesn't have permission for a document
 */
export class AccessDeniedError extends CollabError {
    constructor(message: string = 'Access denied') {
        super(message, 'ACCESS_DENIED');
    }
}
