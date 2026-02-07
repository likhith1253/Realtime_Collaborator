/**
 * Presentation Controller
 * Request handlers for presentation endpoints
 */

import { Request, Response } from 'express';
import * as presentationService from '../services/presentation.service';
import { ValidationError } from '../utils/errors';

/**
 * POST /projects/:projectId/presentations
 * Create a new presentation
 */
export async function createPresentation(req: Request, res: Response): Promise<void> {
    const { projectId } = req.params;
    const { title, template } = req.body;
    const userId = req.user!.userId;

    if (!projectId) {
        throw new ValidationError('Project ID is required');
    }
    if (!title) {
        throw new ValidationError('Title is required');
    }

    const presentation = await presentationService.createPresentation(
        projectId,
        title,
        userId,
        template
    );
    res.status(201).json(presentation);
}

/**
 * GET /projects/:projectId/presentations
 * List presentations for a project
 */
export async function listPresentations(req: Request, res: Response): Promise<void> {
    const { projectId } = req.params;
    const userId = req.user!.userId;

    if (!projectId) {
        throw new ValidationError('Project ID is required');
    }

    const presentations = await presentationService.listPresentations(projectId, userId);
    res.status(200).json(presentations);
}

/**
 * GET /presentations/:presentationId
 * Get a single presentation
 */
export async function getPresentation(req: Request, res: Response): Promise<void> {
    const { presentationId } = req.params;
    const userId = req.user!.userId;

    if (!presentationId) {
        throw new ValidationError('Presentation ID is required');
    }

    const presentation = await presentationService.getPresentation(presentationId, userId);
    res.status(200).json(presentation);
}
