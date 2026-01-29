/**
 * Organization Controller
 * Request handlers for organization endpoints
 */

import { Request, Response } from 'express';
import * as organizationService from '../services/organization.service';
import { ValidationError } from '../utils/errors';

/**
 * POST /organizations
 * Create a new organization
 */
export async function createOrganization(req: Request, res: Response): Promise<void> {
    const { name, slug } = req.body;
    const userId = req.user!.userId;

    // Validate required fields
    if (!name || typeof name !== 'string') {
        throw new ValidationError('Name is required');
    }
    if (!slug || typeof slug !== 'string') {
        throw new ValidationError('Slug is required');
    }

    // Validate slug format (lowercase, alphanumeric, hyphens)
    if (!/^[a-z0-9-]+$/.test(slug)) {
        throw new ValidationError('Slug must be lowercase alphanumeric with hyphens only');
    }

    const organization = await organizationService.createOrganization(name, slug, userId);
    res.status(201).json(organization);
}

/**
 * GET /organizations
 * List user's organizations
 */
export async function listOrganizations(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId;

    const result = await organizationService.listOrganizations(userId);
    res.status(200).json(result);
}
