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
            created_by: userId
        }
    });

    return {
        id: project.id,
        name: project.name,
        created_by: project.created_by
    };
}

/**
 * List projects in an organization
 */
export async function listProjects(organizationId: string, userId: string) {
    // Verify organization exists
    const organization = await prisma.organization.findUnique({
        where: { id: organizationId }
    });

    if (!organization) {
        throw new OrganizationNotFoundError();
    }

    const projects = await prisma.project.findMany({
        where: { organization_id: organizationId },
        orderBy: { created_at: 'desc' }
    });

    return {
        projects: projects.map((project: Project) => ({
            id: project.id,
            name: project.name,
            description: project.description,
            created_by: project.created_by,
            created_at: project.created_at.toISOString()
        }))
    };
}

/**
 * Delete a project and all its documents
 */
export async function deleteProject(projectId: string, userId: string) {
    // Find the project
    const project = await prisma.project.findUnique({
        where: { id: projectId }
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
