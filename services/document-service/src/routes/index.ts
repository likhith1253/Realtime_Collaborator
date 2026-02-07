/**
 * Routes Index
 * Central router that mounts all sub-routers
 */

import { Router } from 'express';
import organizationRoutes from './organization.routes';
import projectRoutes from './project.routes';
import documentRoutes from './document.routes';
import slideRoutes from './slide.routes';
import presentationRoutes from './presentation.routes';
import canvasRoutes from './canvas.routes';
import inviteRoutes from './invite.routes';

const router = Router();

// Mount sub-routers
router.use('/', presentationRoutes);
router.use('/', slideRoutes); // Mount slide routes first to handle specific /projects paths
router.use('/', canvasRoutes); // Mount canvas routes
router.use('/organizations', organizationRoutes);
router.use('/projects', projectRoutes);
router.use('/projects', inviteRoutes); // Mount invite under /projects for /:projectId/invite
router.use('/documents', documentRoutes);
router.use('/', inviteRoutes); // Also mount at root for /invites/:token

export default router;
