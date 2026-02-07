/**
 * Slide Controller
 * Request handlers for slide endpoints
 */

import { Request, Response } from 'express';
import * as slideService from '../services/slide.service';
import { ValidationError } from '../utils/errors';

/**
 * POST /presentations/:presentationId/slides
 * Create a new slide
 */
export async function createSlide(req: Request, res: Response): Promise<void> {
    const { presentationId } = req.params;
    const { title, content } = req.body;
    const userId = req.user!.userId;

    if (!presentationId) {
        throw new ValidationError('Presentation ID is required');
    }
    if (!title) {
        throw new ValidationError('Title is required');
    }

    const slide = await slideService.createSlide(
        presentationId,
        title,
        content || '',
        userId
    );
    res.status(201).json(slide);
}

/**
 * GET /presentations/:presentationId/slides
 * List slides for a presentation
 */
export async function listSlides(req: Request, res: Response): Promise<void> {
    const { presentationId } = req.params;
    const userId = req.user!.userId;

    if (!presentationId) {
        throw new ValidationError('Presentation ID is required');
    }

    const slides = await slideService.listSlides(presentationId, userId);
    res.status(200).json(slides);
}

/**
 * PUT /slides/:slideId
 * Update a slide
 */
export async function updateSlide(req: Request, res: Response): Promise<void> {
    const { slideId } = req.params;
    const { title, content, order } = req.body;
    const userId = req.user!.userId;

    if (!slideId) {
        throw new ValidationError('Slide ID is required');
    }

    const slide = await slideService.updateSlide(
        slideId,
        userId,
        { title, content, order }
    );
    res.status(200).json(slide);
}

/**
 * DELETE /slides/:slideId
 * Delete a slide
 */
export async function deleteSlide(req: Request, res: Response): Promise<void> {
    const { slideId } = req.params;
    const userId = req.user!.userId;

    if (!slideId) {
        throw new ValidationError('Slide ID is required');
    }

    await slideService.deleteSlide(slideId, userId);
    res.status(200).json({ success: true });
}

/**
 * GET /slides/:slideId
 * Get a single slide
 */
export async function getSlide(req: Request, res: Response): Promise<void> {
    const { slideId } = req.params;
    const userId = req.user!.userId;

    if (!slideId) {
        throw new ValidationError('Slide ID is required');
    }

    const slide = await slideService.getSlide(slideId, userId);
    res.status(200).json(slide);
}
