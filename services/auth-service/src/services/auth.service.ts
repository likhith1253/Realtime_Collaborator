import bcrypt from 'bcrypt';
import { SigninUser, SignupUser } from '@packages/types';
// @ts-ignore - Prisma client is not fully typed in this context yet
import { PrismaClient } from '@collab/database';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
// @ts-ignore - Local module resolution
import { createLogger } from '@packages/logger';

const prisma = new PrismaClient();
const logger = createLogger('auth-service');

export class AuthService {
    async register(data: SignupUser) {
        const existingUser = await prisma.user.findFirst({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new Error('User already exists');
        }

        // Check invite token if present
        let invitation = null;
        if ((data as any).inviteToken) {
            invitation = await prisma.invitation.findUnique({ where: { token: (data as any).inviteToken } });
            if (!invitation || invitation.expires_at < new Date() || invitation.accepted) {
                // Should we block registration? The user requirement says "Validate token".
                // If invalid, maybe just ignore or throw?
                // "On signup with inviteToken: Validate token" -> Implies failure if invalid?
                // But user might still want to sign up. 
                // Let's throw for now to make it explicit.
                throw new Error('Invalid or expired invite token');
            }
            if (invitation.email !== data.email) {
                throw new Error('Invite email does not match signup email');
            }
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create an organization for the user
        const user = await prisma.$transaction(async (tx: any) => {
            const orgName = (data as any).organization_name || `${data.full_name}'s Organization`;
            const org = await tx.organization.create({
                data: {
                    name: orgName,
                    slug: `${String(orgName).toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
                }
            });

            const newUser = await tx.user.create({
                data: {
                    email: data.email,
                    password_hash: hashedPassword,
                    full_name: data.full_name,
                    organization_id: org.id,
                    role: 'owner'
                },
            });

            if (invitation) {
                await tx.teamMember.create({
                    data: {
                        project_id: invitation.project_id,
                        user_id: newUser.id,
                        role: invitation.role,
                    }
                });

                await tx.invitation.update({
                    where: { id: invitation.id },
                    data: { accepted: true }
                });
            }

            return newUser;
        });

        const organization = await prisma.organization.findUnique({
            where: { id: user.organization_id }
        });

        const payload = { userId: user.id, email: user.email, role: user.role, organizationId: user.organization_id };
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);

        logger.info(`User registered: ${user.id}`);

        return {
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
                organization_id: user.organization_id,
                organization: organization
                    ? { id: organization.id, name: organization.name, slug: organization.slug }
                    : null
            },
            token: accessToken,
            refresh_token: refreshToken,
        };
    }

    async login(data: SigninUser) {
        const user = await prisma.user.findFirst({
            where: { email: data.email },
        });

        if (!user || !user.password_hash) {
            throw new Error('Invalid credentials');
        }

        const validPassword = await bcrypt.compare(data.password, user.password_hash);
        if (!validPassword) {
            throw new Error('Invalid credentials');
        }

        const payload = { userId: user.id, email: user.email, role: user.role, organizationId: user.organization_id };
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken(payload);

        logger.info(`User logged in: ${user.id}`);

        const organization = await prisma.organization.findUnique({
            where: { id: user.organization_id }
        });

        return {
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
                avatar_url: user.avatar_url,
                organization_id: user.organization_id,
                organization: organization
                    ? { id: organization.id, name: organization.name, slug: organization.slug }
                    : null
            },
            token: accessToken,
            refresh_token: refreshToken,
        };
    }

    async refresh(token: string) {
        const payload = verifyRefreshToken(token);
        if (!payload) {
            throw new Error('Invalid refresh token');
        }

        // Verify user still exists
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
        });

        if (!user) {
            throw new Error('User not found');
        }

        const newPayload = { userId: user.id, email: user.email, role: user.role, organizationId: user.organization_id };
        const newAccessToken = signAccessToken(newPayload);
        const newRefreshToken = signRefreshToken(newPayload); // Rotate refresh token

        return {
            token: newAccessToken,
            refresh_token: newRefreshToken,
        };
    }
}
