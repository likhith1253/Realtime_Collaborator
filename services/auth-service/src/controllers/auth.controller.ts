import { Request, Response } from 'express';
// @ts-ignore - Local module resolution
import { AuthService } from '../services/auth.service';
// @ts-ignore - Prisma client is not fully typed in this context yet
import { PrismaClient } from '@collab/database';
// @ts-ignore - Local module resolution
import { RegisterSchema, LoginSchema, RefreshTokenSchema } from '@packages/types';

const authService = new AuthService();
const prisma = new PrismaClient();

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const validatedData = RegisterSchema.parse(req.body);
            const result = await authService.register(validatedData);
            res.status(201).json(result);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                res.status(400).json({ error: error.errors });
            } else {
                res.status(400).json({ error: error.message });
            }
        }
    }

    async login(req: Request, res: Response) {
        try {
            console.log('[DEBUG] Login Request Body:', JSON.stringify(req.body, null, 2));
            const validatedData = LoginSchema.parse(req.body);
            const result = await authService.login(validatedData);
            res.status(200).json(result);
        } catch (error: any) {
            if (error.name === 'ZodError') {
                res.status(400).json({ error: error.errors });
            } else {
                res.status(401).json({ error: error.message });
            }
        }
    }

    async refresh(req: Request, res: Response) {
        try {
            const validatedData = RefreshTokenSchema.parse(req.body);
            const result = await authService.refresh(validatedData.refresh_token);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }

    async getMe(req: Request, res: Response) {
        try {
            // User is attached by auth middleware
            const user = (req as any).user;
            if (!user) {
                res.status(401).json({ error: 'Not authenticated' });
                return;
            }
            const dbUser = await prisma.user.findUnique({
                where: { id: user.userId },
                include: { organization: true }
            });

            if (!dbUser) {
                res.status(401).json({ error: 'Not authenticated' });
                return;
            }

            res.status(200).json({
                id: dbUser.id,
                email: dbUser.email,
                full_name: dbUser.full_name,
                role: dbUser.role,
                avatar_url: dbUser.avatar_url,
                organization_id: dbUser.organization_id,
                organization: dbUser.organization
                    ? {
                        id: dbUser.organization.id,
                        name: dbUser.organization.name,
                        slug: dbUser.organization.slug
                    }
                    : null,
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateProfile(req: Request, res: Response) {
        try {
            // User is attached by auth middleware
            const user = (req as any).user;
            if (!user) {
                res.status(401).json({ error: 'Not authenticated' });
                return;
            }

            const { full_name, avatar_url } = req.body;

            // Validate that at least one field is provided
            if (!full_name && avatar_url === undefined) {
                res.status(400).json({ error: 'No fields to update' });
                return;
            }

            // Build update data object
            const updateData: { full_name?: string; avatar_url?: string } = {};
            if (full_name) {
                updateData.full_name = full_name;
            }
            if (avatar_url !== undefined) {
                updateData.avatar_url = avatar_url;
            }

            const updatedUser = await prisma.user.update({
                where: { id: user.userId },
                data: updateData,
                include: { organization: true }
            });

            res.status(200).json({
                id: updatedUser.id,
                email: updatedUser.email,
                full_name: updatedUser.full_name,
                role: updatedUser.role,
                avatar_url: updatedUser.avatar_url,
                organization_id: updatedUser.organization_id,
                organization: updatedUser.organization
                    ? {
                        id: updatedUser.organization.id,
                        name: updatedUser.organization.name,
                        slug: updatedUser.organization.slug
                    }
                    : null,
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}

