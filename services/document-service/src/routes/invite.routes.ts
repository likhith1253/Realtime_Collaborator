import { Router } from 'express';
import { InviteController } from '../controllers/invite.controller';
import { requireAuth } from '../middleware/auth.middleware'; // Assuming auth middleware exists

const router = Router();
const inviteController = new InviteController();

// Create invite (Protected, Project Owner)
router.post('/:projectId/invite', requireAuth, inviteController.createInvite.bind(inviteController));

// Get invite (Public? Or just via token)
router.get('/invites/:token', inviteController.getInvite.bind(inviteController));

export default router;
