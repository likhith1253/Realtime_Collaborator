/**
 * Document Controller
 * Request handlers for document and version endpoints
 */

import { Request, Response } from 'express';
import * as documentService from '../services/document.service';
import { ValidationError } from '../utils/errors';

/**
 * POST /documents
 * Create a new document
 */
export async function createDocument(req: Request, res: Response): Promise<void> {
    const { title, project_id } = req.body;
    const userId = req.user!.userId;

    // Validate required fields
    if (!title || typeof title !== 'string') {
        throw new ValidationError('Title is required');
    }
    if (!project_id || typeof project_id !== 'string') {
        throw new ValidationError('Project ID is required');
    }

    const document = await documentService.createDocument(title, project_id, userId);
    res.status(201).json(document);
}

/**
 * GET /documents
 * List documents in a project
 */
export async function listDocuments(req: Request, res: Response): Promise<void> {
    const { project_id } = req.query;
    const userId = req.user!.userId;

    // Validate required query parameter
    if (!project_id || typeof project_id !== 'string') {
        throw new ValidationError('project_id query parameter is required');
    }

    const result = await documentService.listDocuments(project_id, userId);
    res.status(200).json(result);
}

/**
 * GET /documents/:id
 * Get a single document
 */
export async function getDocument(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = req.user!.userId;

    if (!id) {
        throw new ValidationError('Document ID is required');
    }

    const document = await documentService.getDocument(id, userId);
    res.status(200).json(document);
}

/**
 * PATCH /documents/:id
 * Update a document
 */
export async function updateDocument(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { title } = req.body;
    const userId = req.user!.userId;

    if (!id) {
        throw new ValidationError('Document ID is required');
    }
    if (!title || typeof title !== 'string') {
        throw new ValidationError('Title is required');
    }

    const document = await documentService.updateDocument(id, title, userId);
    res.status(200).json(document);
}

/**
 * DELETE /documents/:id
 * Delete a document
 */
export async function deleteDocument(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = req.user!.userId;

    if (!id) {
        throw new ValidationError('Document ID is required');
    }

    const result = await documentService.deleteDocument(id, userId);
    res.status(200).json(result);
}

/**
 * POST /documents/:id/versions
 * Create a version snapshot
 */
export async function createVersion(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user!.userId;

    if (!id) {
        throw new ValidationError('Document ID is required');
    }

    const version = await documentService.createVersion(id, name || '', userId);
    res.status(201).json(version);
}

/**
 * GET /documents/:id/versions
 * List version history
 */
export async function listVersions(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = req.user!.userId;

    if (!id) {
        throw new ValidationError('Document ID is required');
    }

    const result = await documentService.listVersions(id, userId);
    res.status(200).json(result);
}
