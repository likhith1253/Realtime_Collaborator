"use strict";
/**
 * Project Service
 * Business logic for project management
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = createProject;
exports.listProjects = listProjects;
exports.getProjectById = getProjectById;
exports.deleteProject = deleteProject;
const database_1 = require("@collab/database");
const errors_1 = require("../utils/errors");
const prisma = new database_1.PrismaClient();
/**
 * Create a new project
 */
async function createProject(name, description, organizationId, userId) {
    // Verify organization exists
    const organization = await prisma.organization.findUnique({
        where: { id: organizationId }
    });
    if (!organization) {
        throw new errors_1.OrganizationNotFoundError();
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
async function listProjects(userId) {
    const projects = await prisma.project.findMany({
        where: {
            owner_id: userId
        },
        orderBy: { created_at: 'desc' }
    });
    return {
        projects: projects.map((project) => ({
            id: project.id,
            name: project.name,
            description: project.description,
            organization_id: project.organization_id,
            created_by: project.created_by,
            owner_id: project.owner_id, // Cast as it might be missing in old types
            created_at: project.created_at.toISOString(),
            updated_at: project.updated_at.toISOString()
        }))
    };
}
/**
 * Get a project by ID (ensuring ownership)
 */
async function getProjectById(projectId, userId) {
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            owner_id: userId
        }
    });
    if (!project) {
        throw new errors_1.ProjectNotFoundError();
    }
    return {
        id: project.id,
        name: project.name,
        description: project.description,
        organization_id: project.organization_id,
        created_by: project.created_by,
        owner_id: project.owner_id,
        created_at: project.created_at.toISOString(),
        updated_at: project.updated_at.toISOString()
    };
}
/**
 * Delete a project and all its documents
 */
async function deleteProject(projectId, userId) {
    // Find the project and verify ownership
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            owner_id: userId
        }
    });
    if (!project) {
        throw new errors_1.ProjectNotFoundError();
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
