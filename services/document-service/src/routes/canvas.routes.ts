/**
 * Canvas Routes
 * Wire canvas endpoints with auth middleware
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import { auth } from '../middleware/auth.middleware';
import * as canvasController from '../controllers/canvas.controller';

const router = Router();

// GET /projects/:projectId/canvases - List all canvases for project (requires project:read scope)
router.get(
    '/projects/:projectId/canvases',
    auth('project:read'),
    asyncHandler(canvasController.listProjectCanvases)
);

// GET /projects/:projectId/canvas - Get canvas for project (requires project:read scope)
router.get(
    '/projects/:projectId/canvas',
    auth('project:read'),
    asyncHandler(canvasController.getProjectCanvas)
);

// POST /projects/:projectId/canvas - Create canvas for project (requires project:write scope)
router.post(
    '/projects/:projectId/canvas',
    auth('project:write'),
    asyncHandler(canvasController.createProjectCanvas)
);

// PUT /canvas/:canvasId - Update canvas (requires project:write scope)
router.put(
    '/canvas/:canvasId',
    auth('project:write'),
    asyncHandler(canvasController.updateCanvas)
);

// GET /canvas/:canvasId - Get canvas by ID (requires project:read scope)
router.get(
    '/canvas/:canvasId',
    auth('project:read'),
    asyncHandler(canvasController.getCanvas)
);

export default router;
