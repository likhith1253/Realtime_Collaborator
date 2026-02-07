import { Router } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import { auth } from '../middleware/auth.middleware';
import * as presentationController from '../controllers/presentation.controller';
import * as slideController from '../controllers/slide.controller'; // Correction: I might need this later, but for now just presentation

const router = Router();

// POST /projects/:projectId/presentations
router.post(
    '/projects/:projectId/presentations',
    auth('project:write'),
    asyncHandler(presentationController.createPresentation)
);

// GET /projects/:projectId/presentations
router.get(
    '/projects/:projectId/presentations',
    auth('project:read'),
    asyncHandler(presentationController.listPresentations)
);

// GET /presentations/:presentationId
router.get(
    '/presentations/:presentationId',
    auth('project:read'),
    asyncHandler(presentationController.getPresentation)
);

export default router;
