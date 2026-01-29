"use strict";
/**
 * Error Handling Middleware
 * Centralizes error handling and formats errors according to API contract
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.asyncHandler = asyncHandler;
const errors_1 = require("../utils/errors");
const logger_1 = require("../logger");
/**
 * Express error handling middleware
 * Converts all errors to standardized API response format
 */
function errorHandler(err, req, res, next) {
    // Log the error
    logger_1.logger.error('Error occurred:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });
    // Handle known operational errors
    if (err instanceof errors_1.AppError) {
        const response = {
            success: false,
            error: {
                code: err.code,
                message: err.message
            }
        };
        res.status(err.statusCode).json(response);
        return;
    }
    // Handle unknown errors (programming errors, etc.)
    const response = {
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
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
