/**
 * Organization Service
 * Business logic for organization management
 */

import { PrismaClient } from '@collab/database';
import { SlugExistsError, OrganizationNotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

/**
 * Create a new organization
 */
export async function createOrganization(
    name: string,
    slug: string,
    userId: string
) {
    // Check if slug already exists
    const existing = await prisma.organization.findUnique({
        where: { slug }
    });

    if (existing) {
        throw new SlugExistsError();
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
export async function listOrganizations(userId: string) {
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
