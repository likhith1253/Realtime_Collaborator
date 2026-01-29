"use strict";
/**
 * Organization Service
 * Business logic for organization management
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrganization = createOrganization;
exports.listOrganizations = listOrganizations;
const database_1 = require("@collab/database");
const errors_1 = require("../utils/errors");
const prisma = new database_1.PrismaClient();
/**
 * Create a new organization
 */
async function createOrganization(name, slug, userId) {
    // Check if slug already exists
    const existing = await prisma.organization.findUnique({
        where: { slug }
    });
    if (existing) {
        throw new errors_1.SlugExistsError();
    }
    const organization = await prisma.organization.create({
        data: {
            name,
            slug
        }
    });
    // Associate user with organization (update their organization_id)
    await prisma.user.update({
        where: { id: userId },
        data: { organization_id: organization.id }
    });
    return {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        created_at: organization.created_at.toISOString()
    };
}
/**
 * List organizations the user belongs to
 * Currently returns the user's organization
 */
async function listOrganizations(userId) {
    // Get user with their organization
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            organization: true
        }
    });
    if (!user || !user.organization) {
        return { organizations: [] };
    }
    // For now, a user belongs to one org. Return it with role info.
    return {
        organizations: [
            {
                id: user.organization.id,
                name: user.organization.name,
                slug: user.organization.slug,
                role: user.role // User's role in the org
            }
        ]
    };
}
