/**
 * Project Routes
 * Wire project endpoints with auth middleware
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import { auth } from '../middleware/auth.middleware';
import * as projectController from '../controllers/project.controller';
import * as documentController from '../controllers/document.controller';
import * as teamController from '../controllers/team.controller';
import * as messageController from '../controllers/message.controller';

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

// GET /projects/:id - Get project (requires project:read scope)
router.get(
    '/:id',
    auth('project:read'),
    asyncHandler(projectController.getProjectById)
);

// DELETE /projects/:id - Delete project (requires project:delete scope)
router.delete(
    '/:id',
    auth('project:delete'),
    asyncHandler(projectController.deleteProject)
);
// POST /projects/:projectId/documents - Create document in project
router.post(
    '/:projectId/documents',
    auth('doc:write'),
    asyncHandler(documentController.createProjectDocument)
);

// GET /projects/:projectId/documents - List documents in project
router.get(
    '/:projectId/documents',
    auth('doc:read'),
    asyncHandler(documentController.listProjectDocuments)
);

// POST /projects/:projectId/team - Add team member (requires project:write scope)
router.post(
    '/:projectId/team',
    auth('project:write'),
    asyncHandler(teamController.addTeamMember)
);

// GET /projects/:projectId/team - List team members (requires project:read scope)
router.get(
    '/:projectId/team',
    auth('project:read'),
    asyncHandler(teamController.getProjectTeam)
);

// DELETE /projects/:projectId/team/:userId - Remove team member (requires project:write scope)
// Note: 'project:delete' might be too strong, usually 'project:write' covers membership management,
// but owner check is enforced in service.
router.delete(
    '/:projectId/team/:userId',
    auth('project:write'),
    asyncHandler(teamController.removeTeamMember)
);

// ============================================================================
// Message Routes (Chat)
// ============================================================================

// GET /projects/:projectId/messages - List messages (requires project:read scope)
router.get(
    '/:projectId/messages',
    auth('project:read'),
    asyncHandler(messageController.getProjectMessages)
);

// POST /projects/:projectId/messages - Create message (requires project:write scope)
router.post(
    '/:projectId/messages',
    auth('project:write'),
    asyncHandler(messageController.createMessage)
);

export default router;

