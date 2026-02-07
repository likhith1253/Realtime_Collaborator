/**
 * Slide Routes
 * Wire slide endpoints with auth middleware
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import { auth } from '../middleware/auth.middleware';
import * as slideController from '../controllers/slide.controller';

const router = Router();

// POST /presentations/:presentationId/slides - Create slide
router.post(
    '/presentations/:presentationId/slides',
    auth('project:write'),
    asyncHandler(slideController.createSlide)
);

// GET /presentations/:presentationId/slides - List slides
router.get(
    '/presentations/:presentationId/slides',
    auth('project:read'),
    asyncHandler(slideController.listSlides)
);

// PUT /slides/:slideId - Update slide
router.put(
    '/slides/:slideId',
    auth('project:write'),
    asyncHandler(slideController.updateSlide)
);

// DELETE /slides/:slideId - Delete slide
router.delete(
    '/slides/:slideId',
    auth('project:delete'),
    asyncHandler(slideController.deleteSlide)
);

// GET /slides/:slideId - Get slide
router.get(
    '/slides/:slideId',
    auth('project:read'),
    asyncHandler(slideController.getSlide)
);

export default router;
