import { Request, Response } from 'express';
import { OrgService } from '../services/org.service';
import { CreateOrganizationSchema } from '@packages/types';
import { AuthRequest } from '../middleware/auth.middleware';

const orgService = new OrgService();

export class OrgController {
    async create(req: Request, res: Response) {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const validatedData = CreateOrganizationSchema.parse(req.body);
            const org = await orgService.createOrganization(userId, validatedData);
            res.status(201).json(org);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                res.status(400).json({ error: error.errors });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const org = await orgService.getOrganization(req.params.id);
            if (!org) {
                return res.status(404).json({ error: 'Organization not found' });
            }
            // Check access? For now, we assume if you have the ID you can view basic info, 
            // but ideally we should check membership.
            res.json(org);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getMyOrgs(req: Request, res: Response) {
        try {
            const userId = (req as AuthRequest).user!.userId;
            const orgs = await orgService.getUserOrganizations(userId);
            res.json(orgs);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async addMember(req: Request, res: Response) {
        try {
            const { email, role } = req.body;
            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }
            const member = await orgService.addMember(req.params.id, email, role);
            res.json(member);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}
