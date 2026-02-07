/**
 * Message Controller
 * Request handlers for message endpoints
 */

import { Request, Response } from 'express';
import * as messageService from '../services/message.service';
import { ValidationError } from '../utils/errors';

/**
 * GET /projects/:projectId/messages
 * List all messages in a project
 */
export async function getProjectMessages(req: Request, res: Response): Promise<void> {
    const { projectId } = req.params;
    const userId = req.user!.userId;

    if (!projectId) {
        throw new ValidationError('Project ID is required');
    }

    const messages = await messageService.getProjectMessages(projectId, userId);
    res.status(200).json(messages);
}

/**
 * POST /projects/:projectId/messages
 * Create a new message in a project
 */
export async function createMessage(req: Request, res: Response): Promise<void> {
    const { projectId } = req.params;
    const { content } = req.body;
    const userId = req.user!.userId;

    if (!projectId) {
        throw new ValidationError('Project ID is required');
    }

    const message = await messageService.createMessage(projectId, userId, content);
    res.status(201).json(message);
}
