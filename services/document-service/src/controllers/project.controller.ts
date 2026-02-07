/**
 * Project Controller
 * Request handlers for project endpoints
 */

import { Request, Response } from 'express';
import * as projectService from '../services/project.service';
import { ValidationError } from '../utils/errors';

/**
 * POST /projects
 * Create a new project
 */
export async function createProject(req: Request, res: Response): Promise<void> {
    const { name, description, organization_id } = req.body;
    const userId = req.user!.userId;

    // Use provided organization_id or fall back to user's organizationId from token
    const targetOrgId = organization_id || req.user!.organizationId;

    // Validate required fields
    if (!name || typeof name !== 'string') {
        throw new ValidationError('Name is required');
    }
    if (!targetOrgId) {
        throw new ValidationError('Organization ID is required');
    }

    const project = await projectService.createProject(
        name,
        description,
        targetOrgId,
        userId
    );
    res.status(201).json(project);
}

/**
 * GET /projects
 * List projects for the authenticated user
 */
export async function listProjects(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;
    const result = await projectService.listProjects(userId);
    res.status(200).json(result);
}

/**
 * GET /projects/:id
 * Get a specific project
 */
export async function getProjectById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = req.user!.userId;

    if (!id) {
        throw new ValidationError('Project ID is required');
    }

    if (!id || id === 'undefined') {
        throw new ValidationError('Valid Project ID is required');
    }

    const result = await projectService.getProjectById(id, userId);
    res.status(200).json(result);
}

/**
 * DELETE /projects/:id
 * Delete a project
 */
export async function deleteProject(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = req.user!.userId;

    if (!id) {
        throw new ValidationError('Project ID is required');
    }

    const result = await projectService.deleteProject(id, userId);
    res.status(200).json(result);
}
