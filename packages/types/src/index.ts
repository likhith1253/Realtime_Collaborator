import { z } from 'zod';

// ==========================================
// USER & AUTH
// ==========================================

export const UserSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    full_name: z.string(),
    role: z.string(),
    avatar_url: z.string().optional(),
    organization_id: z.string().uuid(),
    created_at: z.date(),
    updated_at: z.date(),
});

export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    full_name: z.string().min(1),
    organization_name: z.string().min(1).optional(),
    inviteToken: z.string().optional(),
});

export type SignupUser = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export type SigninUser = z.infer<typeof LoginSchema>;

export const RefreshTokenSchema = z.object({
    refresh_token: z.string(),
});

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
    organizationId: string;
}

// ==========================================
// ORGANIZATION
// ==========================================

export const OrganizationSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    slug: z.string(),
    created_at: z.date(),
});

export const CreateOrganizationSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
});

// ==========================================
// PROJECT
// ==========================================

export const ProjectSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().optional().nullable(),
    organization_id: z.string().uuid(),
    created_by: z.string().uuid(),
    created_at: z.date(),
});

export const CreateProjectSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    organization_id: z.string().uuid(),
});

// ==========================================
// DOCUMENT
// ==========================================

export const DocumentSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    project_id: z.string().uuid(),
    owner_id: z.string().uuid(),
    updated_at: z.date(),
});

export const CreateDocumentSchema = z.object({
    title: z.string().min(1),
    project_id: z.string().uuid(),
});

export const UpdateDocumentSchema = z.object({
    title: z.string().min(1).optional(),
});
