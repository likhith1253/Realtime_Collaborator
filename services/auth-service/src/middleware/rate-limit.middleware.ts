import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
// @ts-ignore - Local module resolution
import { createLogger } from '@packages/logger';

const logger = createLogger('auth-service');

/**
 * Get client IP from request, accounting for proxy headers
 * This is critical for rate limiting to work correctly behind Render/Vercel proxies
 */
export function resolveClientIp(req: Request): string {
    // 1. Priority: Try our custom trusted header from API Gateway
    const originalClientIp = req.headers['x-original-client-ip'];
    if (originalClientIp) {
        return Array.isArray(originalClientIp) ? originalClientIp[0].trim() : originalClientIp.trim();
    }

    // Try X-Forwarded-For header (set by API Gateway)
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
        // X-Forwarded-For can be a comma-separated list of IPs
        // The first IP is the original client, subsequent IPs are proxies
        const ips = Array.isArray(forwardedFor) ? forwardedFor[0].split(',') : forwardedFor.split(',');
        return ips[0].trim();
    }
    
    // Try X-Real-IP header
    const realIp = req.headers['x-real-ip'];
    if (realIp) {
        return Array.isArray(realIp) ? realIp[0] : realIp;
    }
    
    // Fall back to req.ip (which uses trust proxy settings)
    return req.ip || 'unknown';
}

/**
 * Rate limiter for registration endpoint
 * Limits to 5 registrations per IP per 15 minutes
 * This prevents spam while allowing legitimate users to register
 */
export const registerRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (req: Request) => {
        const ip = resolveClientIp(req);
        const email = req.body?.email || 'no-email';
        const key = `register:${ip}:${email}`;
        const requestId = (req as any).requestId || 'unknown';
        (req as any).rateLimitKey = key;
        logger.info(`[RateLimit] Generated key for registration: ${key} | RequestID: ${requestId} | IP: ${ip}`);
        return key;
    },
    handler: (req: Request, res: Response, next: NextFunction, options: any) => {
        const ip = resolveClientIp(req);
        const email = req.body?.email || 'no-email';
        logger.warn(`[RateLimit] Registration limit exceeded for IP: ${ip}, Email: ${email}`);
        
        res.status(429).json({
            success: false,
            error: {
                code: 'TOO_MANY_REQUESTS',
                message: 'Too many registration attempts. Please wait 15 minutes and try again.',
                details: {
                    limit: options.max,
                    windowMs: options.windowMs
                }
            }
        });
    },
    skip: (req: Request) => {
        // Skip rate limiting in development if needed
        // return process.env.NODE_ENV === 'development';
        return false;
    }
});

/**
 * General rate limiter for all auth endpoints
 * Limits to 100 requests per IP per 15 minutes
 */
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => {
        const ip = resolveClientIp(req);
        const key = `auth:${ip}`;
        const requestId = (req as any).requestId || 'unknown';
        logger.info(`[RateLimit] Generated key for general auth: ${key} | RequestID: ${requestId} | IP: ${ip}`);
        return key;
    },
    handler: (req: Request, res: Response, next: NextFunction, options: any) => {
        const ip = resolveClientIp(req);
        logger.warn(`[RateLimit] General auth limit exceeded for IP: ${ip}`);
        
        res.status(429).json({
            success: false,
            error: {
                code: 'TOO_MANY_REQUESTS',
                message: 'Too many requests. Please slow down and try again.',
                details: {
                    limit: options.max,
                    windowMs: options.windowMs
                }
            }
        });
    }
});
