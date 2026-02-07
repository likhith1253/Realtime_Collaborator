
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import { UnauthorizedError } from '../utils/errors';

export interface AuthRequest extends Request {
    user?: TokenPayload;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined;

        // 1. Check Authorization header
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        // 2. Check cookies (if Header not present or empty)
        if (!token && req.cookies && req.cookies.access_token) {
            token = req.cookies.access_token;
        }

        if (!token) {
            throw new UnauthorizedError('Authentication required');
        }

        // 3. Verify token
        const decoded = verifyAccessToken(token);

        if (!decoded) {
            throw new UnauthorizedError('Invalid or expired token');
        }

        // 4. Attach user to request
        (req as AuthRequest).user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            organizationId: decoded.organizationId
        };

        next();
    } catch (error) {
        next(new UnauthorizedError('Invalid or expired token'));
    }
};
