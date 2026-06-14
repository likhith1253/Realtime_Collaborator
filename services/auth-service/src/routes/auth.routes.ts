import { Router } from 'express';
// @ts-ignore - Local module resolution
import { AuthController } from '../controllers/auth.controller';
import { registerRateLimiter, authRateLimiter } from '../middleware/rate-limit.middleware';

const router = Router();
const authController = new AuthController();

// Apply stricter rate limiting to registration
router.post('/register', registerRateLimiter, authController.register);

// Apply general rate limiting to other auth endpoints
router.post('/login', authRateLimiter, authController.login);
router.post('/refresh', authRateLimiter, authController.refresh);

import { authenticate } from '../middleware/auth.middleware';
router.get('/me', authRateLimiter, authenticate, authController.getMe);
router.put('/profile', authRateLimiter, authenticate, authController.updateProfile);

export default router;
