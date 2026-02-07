import { Router } from 'express';
// @ts-ignore - Local module resolution
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);

import { authenticate } from '../middleware/auth.middleware';
router.get('/me', authenticate, authController.getMe);
router.put('/profile', authenticate, authController.updateProfile);

export default router;
