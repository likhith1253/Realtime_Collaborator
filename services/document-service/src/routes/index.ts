/**
 * Routes Index
 * Central router that mounts all sub-routers
 */

import { Router } from 'express';
import organizationRoutes from './organization.routes';
import projectRoutes from './project.routes';
import documentRoutes from './document.routes';

const router = Router();

// Mount sub-routers
router.use('/organizations', organizationRoutes);
router.use('/projects', projectRoutes);
router.use('/documents', documentRoutes);

export default router;
