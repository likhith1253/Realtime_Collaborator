/**
 * Message Service
 * Business logic for project chat messages
 */

import { PrismaClient } from '@collab/database';
import { ProjectNotFoundError, ForbiddenError, ValidationError } from '../utils/errors';

const prisma = new PrismaClient();

// Helper to access message property safely
const messageClient = (prisma as any).message;
const teamMemberClient = (prisma as any).teamMember;

/**
 * Check if user is a member of the project (owner or team member)
 */
async function isProjectMember(projectId: string, userId: string): Promise<boolean> {
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { owner_id: true }
    });

    if (!project) {
        throw new ProjectNotFoundError();
    }

    // Owner is always a member
    if (project.owner_id === userId) {
        return true;
    }

    // Check team membership
    const membership = await teamMemberClient.findUnique({
        where: {
            project_id_user_id: {
                project_id: projectId,
                user_id: userId
            }
        }
    });

    return !!membership;
}

/**
 * Get all messages for a project
 * @param projectId - Project ID
 * @param userId - Current user ID (for permission check)
 */
export async function getProjectMessages(projectId: string, userId: string) {
    // Check membership
    const isMember = await isProjectMember(projectId, userId);
    if (!isMember) {
        throw new ForbiddenError('You are not a member of this project');
    }

    const messages = await messageClient.findMany({
        where: { project_id: projectId },
        include: {
            sender: {
                select: {
                    id: true,
                    full_name: true,
                    email: true,
                    avatar_url: true
                }
            }
        },
        orderBy: { created_at: 'asc' }
    });

    return messages.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        sender: {
            id: msg.sender.id,
            name: msg.sender.full_name,
            email: msg.sender.email,
            avatar: msg.sender.avatar_url
        },
        timestamp: msg.created_at
    }));
}

/**
 * Create a new message in a project
 * @param projectId - Project ID
 * @param senderId - User ID of the sender
 * @param content - Message content
 */
export async function createMessage(projectId: string, senderId: string, content: string) {
    if (!content || content.trim().length === 0) {
        throw new ValidationError('Message content is required');
    }

    // Check membership
    const isMember = await isProjectMember(projectId, senderId);
    if (!isMember) {
        throw new ForbiddenError('You are not a member of this project');
    }

    const message = await messageClient.create({
        data: {
            project_id: projectId,
            sender_id: senderId,
            content: content.trim()
        },
        include: {
            sender: {
                select: {
                    id: true,
                    full_name: true,
                    email: true,
                    avatar_url: true
                }
            }
        }
    });

    return {
        id: message.id,
        content: message.content,
        sender: {
            id: message.sender.id,
            name: message.sender.full_name,
            email: message.sender.email,
            avatar: message.sender.avatar_url
        },
        timestamp: message.created_at
    };
}
