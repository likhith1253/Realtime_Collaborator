/**
 * Document Routes
 * Wire document endpoints with auth middleware
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import { auth } from '../middleware/auth.middleware';
import * as documentController from '../controllers/document.controller';

const router = Router();

// POST /documents - Create document (requires doc:write scope)
router.post(
    '/',
    auth('doc:write'),
    asyncHandler(documentController.createDocument)
);

// GET /documents - List documents (requires doc:read scope)
router.get(
    '/',
    auth('doc:read'),
    asyncHandler(documentController.listDocuments)
);

// GET /documents/:id - Get single document (requires doc:read scope)
router.get(
    '/:id',
    auth('doc:read'),
    asyncHandler(documentController.getDocument)
);

// PATCH /documents/:id - Update document (requires doc:write scope)
router.patch(
    '/:id',
    auth('doc:write'),
    asyncHandler(documentController.updateDocument)
);

// PUT /documents/:id - Update document (REST alias for PATCH)
router.put(
    '/:id',
    auth('doc:write'),
    asyncHandler(documentController.updateDocument)
);

// DELETE /documents/:id - Delete document (requires doc:delete scope)
router.delete(
    '/:id',
    auth('doc:delete'),
    asyncHandler(documentController.deleteDocument)
);

// POST /documents/:id/versions - Create version (requires doc:write scope)
router.post(
    '/:id/versions',
    auth('doc:write'),
    asyncHandler(documentController.createVersion)
);

// GET /documents/:id/versions - List versions (requires doc:read scope)
router.get(
    '/:id/versions',
    auth('doc:read'),
    asyncHandler(documentController.listVersions)
);

export default router;
