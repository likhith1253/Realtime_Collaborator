/**
 * Custom Error Classes for Auth Service
 * Provides structured error handling with status codes and error codes
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

// Specific Auth Errors
export class EmailExistsError extends ConflictError {
    constructor() {
        super('A user with this email already exists', 'EMAIL_EXISTS');
    }
}

export class InvalidCredentialsError extends UnauthorizedError {
    constructor() {
        super('Invalid email or password', 'INVALID_CREDENTIALS');
    }
}

export class InvalidTokenError extends UnauthorizedError {
    constructor() {
        super('Invalid or expired token', 'INVALID_TOKEN');
    }
}

export class UserNotFoundError extends NotFoundError {
    constructor() {
        super('User not found', 'USER_NOT_FOUND');
    }
}
