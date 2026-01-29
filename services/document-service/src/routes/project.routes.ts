/**
 * Project Routes
 * Wire project endpoints with auth middleware
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import { auth } from '../middleware/auth.middleware';
import * as projectController from '../controllers/project.controller';

const router = Router();

// POST /projects - Create project (requires project:write scope)
router.post(
    '/',
    auth('project:write'),
    asyncHandler(projectController.createProject)
);

// GET /projects - List projects (requires project:read scope)
router.get(
    '/',
    auth('project:read'),
    asyncHandler(projectController.listProjects)
);

// DELETE /projects/:id - Delete project (requires project:delete scope)
router.delete(
    '/:id',
    auth('project:delete'),
    asyncHandler(projectController.deleteProject)
);

export default router;
