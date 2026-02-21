/**
 * Error Handling Middleware
 * Centralizes error handling and formats errors according to API contract
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../logger';

/**
 * Standard error response format as defined in API contracts
 */
interface ErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: Record<string, unknown>;
    };
}

/**
 * Express error handling middleware
 * Converts all errors to standardized API response format
 */
export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Determine status code and message
    let status = 500;
    let message = 'An unexpected error occurred';
    let code = 'INTERNAL_ERROR';
    let details: Record<string, unknown> | undefined = undefined;

    if (err instanceof AppError) {
    }
};
res.status(err.statusCode).json(response);
return;
    }

// Handle unknown errors (programming errors, etc.)
const response: ErrorResponse = {
    success: false,
    error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred'
    }
};

// In development, include the actual error message
if (process.env.NODE_ENV === 'development') {
    response.error.details = { originalMessage: err.message };
}

res.status(500).json(response);
}

/**
 * Async handler wrapper to catch errors from async route handlers
 * Eliminates need for try-catch in every async controller
 */
export function asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
