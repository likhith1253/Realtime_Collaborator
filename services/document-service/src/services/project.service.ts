/**
 * Project Service
 * Business logic for project management
 */

import { PrismaClient, Project } from '@collab/database';
import { ProjectNotFoundError, OrganizationNotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

/**
 * Create a new project
 */
export async function createProject(
    name: string,
    description: string | undefined,
    organizationId: string,
    userId: string
) {
    // Verify organization exists
    const organization = await prisma.organization.findUnique({
        where: { id: organizationId }
    });

    if (!organization) {
        throw new OrganizationNotFoundError();
    }

    const project = await prisma.project.create({
        data: {
            name,
            description: description || null,
            organization_id: organizationId,
            created_by: userId,
            owner_id: userId
        }
    });

    return {
        id: project.id,
        name: project.name,
        description: project.description,
        created_by: project.created_by,
        organization_id: project.organization_id,
        owner_id: project.owner_id,
        created_at: project.created_at.toISOString(),
        updated_at: project.updated_at.toISOString()
    };
}

/**
 * List projects for the authenticated user
 */
export async function listProjects(userId: string) {
    // FALLBACK: Use simple query until Prisma Client is regenerated
    const projects = await prisma.project.findMany({
        where: {
            owner_id: userId
        },
        // Remove include until schema update is applied
        // include: {
        //     team_members: { ... }
        // },
        orderBy: { created_at: 'desc' }
    });

    return projects.map((project: any) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        organization_id: project.organization_id,
        created_by: project.created_by,
        owner_id: project.owner_id as string,
        created_at: project.created_at.toISOString(),
        updated_at: project.updated_at.toISOString(),
        members: [] // Return empty members for now to prevent frontend crash
    }));
}

/**
 * Get a project by ID (ensuring ownership)
 */
export async function getProjectById(projectId: string, userId: string) {
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            owner_id: userId
        },
        // Remove include until schema update is applied
        // include: { team_members: ... }
    });

    if (!project) {
        throw new ProjectNotFoundError();
    }

    return {
        id: project.id,
        name: project.name,
        description: project.description,
        organization_id: project.organization_id,
        created_by: project.created_by,
        owner_id: project.owner_id as string,
        created_at: project.created_at.toISOString(),
        updated_at: project.updated_at.toISOString(),
        members: [] // Return empty members for now
    };
}

/**
 * Delete a project and all its documents
 */
export async function deleteProject(projectId: string, userId: string) {
    // Find the project and verify ownership
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            owner_id: userId
        }
    });

    if (!project) {
        throw new ProjectNotFoundError();
    }

    // Delete all documents in the project first (cascade)
    // Delete document versions first
    await prisma.documentVersion.deleteMany({
        where: {
            document: {
                project_id: projectId
            }
        }
    });

    // Then delete documents
    await prisma.document.deleteMany({
        where: { project_id: projectId }
    });

    // Finally delete the project
    await prisma.project.delete({
        where: { id: projectId }
    });

    return { success: true };
}
