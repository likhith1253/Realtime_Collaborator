"use strict";
/**
 * Custom Error Classes for Document Service
 * Provides structured error handling with status codes and error codes
 * Following API contract error response format
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotFoundError = exports.SlugExistsError = exports.CanvasNotFoundError = exports.DocumentNotFoundError = exports.ProjectNotFoundError = exports.OrganizationNotFoundError = exports.InsufficientScopeError = exports.InvalidTokenError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.ValidationError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;
        // Maintains proper stack trace for where our error was thrown
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
// 400 Bad Request Errors
class ValidationError extends AppError {
    constructor(message, code = 'VALIDATION_ERROR') {
        super(message, 400, code);
    }
}
exports.ValidationError = ValidationError;
// 401 Unauthorized Errors
class UnauthorizedError extends AppError {
    constructor(message, code = 'UNAUTHORIZED') {
        super(message, 401, code);
    }
}
exports.UnauthorizedError = UnauthorizedError;
// 403 Forbidden Errors
class ForbiddenError extends AppError {
    constructor(message, code = 'FORBIDDEN') {
        super(message, 403, code);
    }
}
exports.ForbiddenError = ForbiddenError;
// 404 Not Found Errors
class NotFoundError extends AppError {
    constructor(message, code = 'NOT_FOUND') {
        super(message, 404, code);
    }
}
exports.NotFoundError = NotFoundError;
// 409 Conflict Errors
class ConflictError extends AppError {
    constructor(message, code = 'CONFLICT') {
        super(message, 409, code);
    }
}
exports.ConflictError = ConflictError;
// Specific Document Service Errors
class InvalidTokenError extends UnauthorizedError {
    constructor() {
        super('Invalid or expired token', 'INVALID_TOKEN');
    }
}
exports.InvalidTokenError = InvalidTokenError;
class InsufficientScopeError extends ForbiddenError {
    constructor(requiredScope) {
        super(`Insufficient scope. Required: ${requiredScope}`, 'INSUFFICIENT_SCOPE');
    }
}
exports.InsufficientScopeError = InsufficientScopeError;
class OrganizationNotFoundError extends NotFoundError {
    constructor() {
        super('Organization not found', 'ORGANIZATION_NOT_FOUND');
    }
}
exports.OrganizationNotFoundError = OrganizationNotFoundError;
class ProjectNotFoundError extends NotFoundError {
    constructor() {
        super('Project not found', 'PROJECT_NOT_FOUND');
    }
}
exports.ProjectNotFoundError = ProjectNotFoundError;
class DocumentNotFoundError extends NotFoundError {
    constructor() {
        super('Document not found', 'DOCUMENT_NOT_FOUND');
    }
}
exports.DocumentNotFoundError = DocumentNotFoundError;
class CanvasNotFoundError extends NotFoundError {
    constructor() {
        super('Canvas not found', 'CANVAS_NOT_FOUND');
    }
}
exports.CanvasNotFoundError = CanvasNotFoundError;
class SlugExistsError extends ConflictError {
    constructor() {
        super('An organization with this slug already exists', 'SLUG_EXISTS');
    }
}
exports.SlugExistsError = SlugExistsError;
class UserNotFoundError extends NotFoundError {
    constructor(message = 'User not found') {
        super(message, 'USER_NOT_FOUND');
    }
}
exports.UserNotFoundError = UserNotFoundError;
