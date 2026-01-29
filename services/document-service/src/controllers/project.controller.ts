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

    // Validate required fields
    if (!name || typeof name !== 'string') {
        throw new ValidationError('Name is required');
    }
    if (!organization_id || typeof organization_id !== 'string') {
        throw new ValidationError('Organization ID is required');
    }

    const project = await projectService.createProject(
        name,
        description,
        organization_id,
        userId
    );
    res.status(201).json(project);
}

/**
 * GET /projects
 * List projects in an organization
 */
export async function listProjects(req: Request, res: Response): Promise<void> {
    const { organization_id } = req.query;
    const userId = req.user!.userId;

    // Validate required query parameter
    if (!organization_id || typeof organization_id !== 'string') {
        throw new ValidationError('organization_id query parameter is required');
    }

    const result = await projectService.listProjects(organization_id, userId);
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
