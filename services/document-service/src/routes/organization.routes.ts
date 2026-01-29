/**
 * Organization Routes
 * Wire organization endpoints with auth middleware
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import { auth } from '../middleware/auth.middleware';
import * as organizationController from '../controllers/organization.controller';

const router = Router();

// POST /organizations - Create organization (requires org:write scope)
router.post(
    '/',
    auth('org:write'),
    asyncHandler(organizationController.createOrganization)
);

// GET /organizations - List organizations (requires org:read scope)
router.get(
    '/',
    auth('org:read'),
    asyncHandler(organizationController.listOrganizations)
);

export default router;
