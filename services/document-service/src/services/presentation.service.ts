/**
 * Presentation Service
 * Business logic for presentation management
 */

import { PrismaClient } from '@collab/database';
import { ProjectNotFoundError, ValidationError } from '../utils/errors';

const prisma = new PrismaClient();

/**
 * Create a new presentation
 */
export async function createPresentation(
    projectId: string,
    title: string,
    userId: string,
    template?: string
) {
    // Verify project exists and user is owner
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            owner_id: userId
        }
    });

    if (!project) {
        throw new ProjectNotFoundError();
    }

    const presentation = await prisma.presentation.create({
        data: {
            project_id: projectId,
            title,
            template
        }
    });

    return presentation;
}

/**
 * List presentations for a project
 */
export async function listPresentations(projectId: string, userId: string) {
    // Verify project exists and user is owner
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            owner_id: userId
        }
    });

    if (!project) {
        throw new ProjectNotFoundError();
    }

    const presentations = await prisma.presentation.findMany({
        where: { project_id: projectId },
        orderBy: { created_at: 'desc' }
    });

    return presentations;
}

/**
 * Get a single presentation
 */
export async function getPresentation(presentationId: string, userId: string) {
    const presentation = await prisma.presentation.findUnique({
        where: { id: presentationId },
        include: { project: true }
    });

    if (!presentation) {
        throw new ValidationError('Presentation not found');
    }

    // @ts-ignore
    if (presentation.project.owner_id !== userId) {
        throw new ProjectNotFoundError();
    }

    return presentation;
}
