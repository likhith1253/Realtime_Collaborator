/**
 * Canvas Controller
 * Request handlers for canvas endpoints
 */

import { Request, Response } from 'express';
import * as canvasService from '../services/canvas.service';
import { ValidationError } from '../utils/errors';

/**
 * GET /projects/:projectId/canvases
 * List all canvases for a project
 */
export async function listProjectCanvases(req: Request, res: Response): Promise<void> {
    const { projectId } = req.params;
    const userId = req.user!.userId;

    if (!projectId || typeof projectId !== 'string') {
        throw new ValidationError('Project ID is required');
    }

    const canvases = await canvasService.getProjectCanvases(projectId, userId);
    res.status(200).json(canvases);
}

/**
 * GET /projects/:projectId/canvas
 * Get canvas for a project (Legacy/Default)
 */
export async function getProjectCanvas(req: Request, res: Response): Promise<void> {
    const { projectId } = req.params;
    const userId = req.user!.userId;

    // Validate projectId
    if (!projectId || typeof projectId !== 'string') {
        throw new ValidationError('Project ID is required');
    }

    const canvas = await canvasService.getProjectCanvas(projectId, userId);
    res.status(200).json(canvas);
}

/**
 * GET /canvas/:canvasId
 * Get a specific canvas by ID
 */
export async function getCanvas(req: Request, res: Response): Promise<void> {
    const { canvasId } = req.params;
    const userId = req.user!.userId;

    if (!canvasId || typeof canvasId !== 'string') {
        throw new ValidationError('Canvas ID is required');
    }

    const canvas = await canvasService.getCanvasById(canvasId, userId);
    res.status(200).json(canvas);
}

/**
 * POST /projects/:projectId/canvas
 * Create canvas for a project
 */
export async function createProjectCanvas(req: Request, res: Response): Promise<void> {
    const { projectId } = req.params;
    const { data, name } = req.body;
    const userId = req.user!.userId;

    // Validate projectId
    if (!projectId || typeof projectId !== 'string') {
        throw new ValidationError('Project ID is required');
    }

    // data is optional, defaults to empty object
    const canvasData = data || {};
    const canvasName = name || 'Untitled Canvas';

    const canvas = await canvasService.createProjectCanvas(projectId, canvasData, userId, canvasName);
    res.status(201).json(canvas);
}

/**
 * PUT /canvas/:canvasId
 * Update canvas
 */
export async function updateCanvas(req: Request, res: Response): Promise<void> {
    const { canvasId } = req.params;
    const { data, name } = req.body;
    const userId = req.user!.userId;

    // Validate canvasId
    if (!canvasId || typeof canvasId !== 'string') {
        throw new ValidationError('Canvas ID is required');
    }

    // Allow updating just name, just data, or both
    if (data === undefined && name === undefined) {
        throw new ValidationError('Canvas data or name is required');
    }

    const canvas = await canvasService.updateCanvas(canvasId, data, userId, name);
    res.status(200).json(canvas);
}
