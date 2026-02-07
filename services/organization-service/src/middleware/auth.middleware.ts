import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { TokenPayload } from '@packages/types';

export interface AuthRequest extends Request {
    user?: TokenPayload;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined;

        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = verifyAccessToken(token);

        if (!decoded) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        (req as AuthRequest).user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid authentication' });
    }
};
