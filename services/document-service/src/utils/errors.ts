/**
 * Custom Error Classes for Document Service
 * Provides structured error handling with status codes and error codes
 * Following API contract error response format
 */

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code: string;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number, code: string) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;

        // Maintains proper stack trace for where our error was thrown
        Error.captureStackTrace(this, this.constructor);
    }
}

// 400 Bad Request Errors
export class ValidationError extends AppError {
    constructor(message: string, code: string = 'VALIDATION_ERROR') {
        super(message, 400, code);
    }
}

// 401 Unauthorized Errors
export class UnauthorizedError extends AppError {
    constructor(message: string, code: string = 'UNAUTHORIZED') {
        super(message, 401, code);
    }
}

// 403 Forbidden Errors
export class ForbiddenError extends AppError {
    constructor(message: string, code: string = 'FORBIDDEN') {
        super(message, 403, code);
    }
}

// 404 Not Found Errors
export class NotFoundError extends AppError {
    constructor(message: string, code: string = 'NOT_FOUND') {
        super(message, 404, code);
    }
}

// 409 Conflict Errors
export class ConflictError extends AppError {
    constructor(message: string, code: string = 'CONFLICT') {
        super(message, 409, code);
    }
}

// Specific Document Service Errors
export class InvalidTokenError extends UnauthorizedError {
    constructor() {
        super('Invalid or expired token', 'INVALID_TOKEN');
    }
}

export class InsufficientScopeError extends ForbiddenError {
    constructor(requiredScope: string) {
        super(`Insufficient scope. Required: ${requiredScope}`, 'INSUFFICIENT_SCOPE');
    }
}

export class OrganizationNotFoundError extends NotFoundError {
    constructor() {
        super('Organization not found', 'ORGANIZATION_NOT_FOUND');
    }
}

export class ProjectNotFoundError extends NotFoundError {
    constructor() {
        super('Project not found', 'PROJECT_NOT_FOUND');
    }
}

export class DocumentNotFoundError extends NotFoundError {
    constructor() {
        super('Document not found', 'DOCUMENT_NOT_FOUND');
    }
}

export class SlugExistsError extends ConflictError {
    constructor() {
        super('An organization with this slug already exists', 'SLUG_EXISTS');
    }
}
