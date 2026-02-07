import { Router } from 'express';
import { OrgController } from '../controllers/org.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const orgController = new OrgController();

// Create new organization
router.post('/', authenticate, orgController.create);

// Get user's organizations
router.get('/me', authenticate, orgController.getMyOrgs);

// Get specific organization
router.get('/:id', authenticate, orgController.getOne);

// Add member
router.post('/:id/members', authenticate, orgController.addMember);

export default router;
