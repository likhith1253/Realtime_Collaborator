/**
 * Collaboration Handler
 * Real-time document content sync and chat using Socket.io
 * 
 * Events:
 * - join-document: Client joins a document room
 * - document-update: Content sync between clients
 * - join-organization: Client joins an org for presence
 * - join-chat: Client joins a project chat room
 * - chat:send: Client sends a chat message
 */

import { Server, Socket } from 'socket.io';
import { logger } from '../logger';
import { DecodedToken } from '../utils/jwt';

// ============================================================================
// State Management
// ============================================================================

/**
 * Map socket ID to authenticated user
 */
const socketUsers: Map<string, DecodedToken> = new Map();

/**
 * Map socket ID to joined document room
 */
const socketRooms: Map<string, string> = new Map();
const socketOrgRooms: Map<string, string> = new Map();
const socketChatRooms: Map<string, Set<string>> = new Map(); // socket -> set of chat rooms

// ============================================================================
// Room Name Helpers
// ============================================================================

function getOrgRoomName(orgId: string): string {
    return `org:${orgId}`;
}

function getChatRoomName(projectId: string): string {
    return `project:${projectId}:chat`;
}

// ============================================================================
// Socket Registration
// ============================================================================

/**
 * Register a socket with user data after authentication
 */
export function registerSocket(socket: Socket, user: DecodedToken): void {
    socketUsers.set(socket.id, user);
}

// ============================================================================
// Organization Handlers
// ============================================================================

/**
 * Handle join-organization event
 * Joins the socket to the organization room for presence
 */
function handleJoinOrganization(
    io: Server,
    socket: Socket,
    payload: { organizationId: string }
): void {
    const { organizationId } = payload;
    const user = socketUsers.get(socket.id);

    if (!user) {
        socket.emit('error', { code: 'AUTH_ERROR', message: 'Not authenticated' });
        return;
    }

    if (!organizationId) {
        socket.emit('error', { code: 'INVALID_PAYLOAD', message: 'organizationId is required' });
        return;
    }

    const roomName = getOrgRoomName(organizationId);

    // Join org room (user can be in doc room AND org room)
    socket.join(roomName);
    socketOrgRooms.set(socket.id, roomName);

    logger.info(`User ${user.email} joined org ${organizationId} (room: ${roomName})`);

    // Broadcast valid user presence to others
    socket.to(roomName).emit('user-online', {
        userId: user.userId,
        email: user.email,
        name: user.name || user.email // Fallback if name is missing
    });

    // Send current online users to the joining client
    const onlineUsers: any[] = [];
    const room = io.sockets.adapter.rooms.get(roomName);

    if (room) {
        room.forEach((socketId) => {
            const roomUser = socketUsers.get(socketId);
            if (roomUser) {
                onlineUsers.push({
                    userId: roomUser.userId,
                    email: roomUser.email,
                    name: roomUser.name || roomUser.email
                });
            }
        });
    }

    // Deduplicate users (same user might be on multiple tabs)
    const uniqueUsers = Array.from(new Map(onlineUsers.map(u => [u.userId, u])).values());

    socket.emit('joined-organization', { organizationId, roomName, onlineUsers: uniqueUsers });
}

// ============================================================================
// Chat Handlers
// ============================================================================

/**
 * Handle join-chat event
 * Joins the socket to a project chat room
 */
function handleJoinChat(
    io: Server,
    socket: Socket,
    payload: { projectId: string }
): void {
    const { projectId } = payload;
    const user = socketUsers.get(socket.id);

    if (!user) {
        socket.emit('error', { code: 'AUTH_ERROR', message: 'Not authenticated' });
        return;
    }

    if (!projectId) {
        socket.emit('error', { code: 'INVALID_PAYLOAD', message: 'projectId is required' });
        return;
    }

    const roomName = getChatRoomName(projectId);

    // Join chat room
    socket.join(roomName);

    // Track chat room membership
    let chatRooms = socketChatRooms.get(socket.id);
    if (!chatRooms) {
        chatRooms = new Set();
        socketChatRooms.set(socket.id, chatRooms);
    }
    chatRooms.add(roomName);

    logger.info(`User ${user.email} joined chat for project ${projectId} (room: ${roomName})`);

    socket.emit('joined-chat', { projectId, roomName });
}

/**
 * Handle leave-chat event
 * Leaves a project chat room
 */
function handleLeaveChat(
    socket: Socket,
    payload: { projectId: string }
): void {
    const { projectId } = payload;
    const user = socketUsers.get(socket.id);
    const roomName = getChatRoomName(projectId);

    socket.leave(roomName);

    const chatRooms = socketChatRooms.get(socket.id);
    if (chatRooms) {
        chatRooms.delete(roomName);
    }

    logger.info(`User ${user?.email || 'unknown'} left chat for project ${projectId}`);
}

/**
 * Handle chat:send event
 * Broadcasts a new message to all users in the project chat room
 */
function handleChatSend(
    io: Server,
    socket: Socket,
    payload: { projectId: string; message: { id: string; content: string; timestamp: string } }
): void {
    const { projectId, message } = payload;
    const user = socketUsers.get(socket.id);

    if (!user) {
        socket.emit('error', { code: 'AUTH_ERROR', message: 'Not authenticated' });
        return;
    }

    if (!projectId || !message) {
        socket.emit('error', { code: 'INVALID_PAYLOAD', message: 'projectId and message are required' });
        return;
    }

    const roomName = getChatRoomName(projectId);

    // Broadcast message to all users in the chat room (including sender for confirmation)
    io.to(roomName).emit('message:new', {
        id: message.id,
        sender: {
            id: user.userId,
            name: user.name || user.email,
            avatar: user.avatar || null
        },
        content: message.content,
        timestamp: message.timestamp
    });

    logger.info(`Chat message sent by ${user.email} in project ${projectId}`);
}

// ============================================================================
// Disconnect Handler
// ============================================================================

function handleDisconnect(socket: Socket): void {
    const user = socketUsers.get(socket.id);
    const roomName = socketRooms.get(socket.id);
    const orgRoomName = socketOrgRooms.get(socket.id);

    if (roomName) {
        logger.info(`User ${user?.email || 'unknown'} left room ${roomName}`);
    }

    if (orgRoomName && user) {
        // Notify others in the org room
        socket.to(orgRoomName).emit('user-offline', { userId: user.userId });
        logger.info(`User ${user?.email || 'unknown'} left org room ${orgRoomName}`);
    }

    // Cleanup all state
    socketUsers.delete(socket.id);
    socketRooms.delete(socket.id);
    socketOrgRooms.delete(socket.id);
    socketChatRooms.delete(socket.id);

    logger.info(`User ${user?.email || 'unknown'} disconnected`);
}

// ============================================================================
// Document Handlers (existing functionality)
// ============================================================================

function handleJoinDocument(
    io: Server,
    socket: Socket,
    payload: { documentId: string }
): void {
    const { documentId } = payload;
    const user = socketUsers.get(socket.id);

    if (!user) {
        socket.emit('error', { code: 'AUTH_ERROR', message: 'Not authenticated' });
        return;
    }

    if (!documentId) {
        socket.emit('error', { code: 'INVALID_PAYLOAD', message: 'documentId is required' });
        return;
    }

    const roomName = `document:${documentId}`;

    // Leave previous document room if any
    const previousRoom = socketRooms.get(socket.id);
    if (previousRoom && previousRoom !== roomName) {
        socket.leave(previousRoom);
    }

    // Join new document room
    socket.join(roomName);
    socketRooms.set(socket.id, roomName);

    logger.info(`User ${user.email} joined document ${documentId}`);

    socket.emit('joined-document', { documentId, roomName });
}

function handleDocumentUpdate(
    io: Server,
    socket: Socket,
    payload: { documentId: string; content: any }
): void {
    const { documentId, content } = payload;
    const user = socketUsers.get(socket.id);

    if (!user) {
        socket.emit('error', { code: 'AUTH_ERROR', message: 'Not authenticated' });
        return;
    }

    const roomName = `document:${documentId}`;

    // Broadcast to all other clients in the room
    socket.to(roomName).emit('document-update', {
        documentId,
        content,
        updatedBy: {
            userId: user.userId,
            email: user.email,
            name: user.name || user.email
        }
    });
}

// ============================================================================
// Main Socket Handler Setup
// ============================================================================

export function setupSocketHandlers(io: Server, socket: Socket): void {
    // Document events
    socket.on('join-document', (payload: { documentId: string }) => {
        handleJoinDocument(io, socket, payload);
    });

    socket.on('document-update', (payload: { documentId: string; content: any }) => {
        handleDocumentUpdate(io, socket, payload);
    });

    // Organization events
    socket.on('join-organization', (payload: { organizationId: string }) => {
        handleJoinOrganization(io, socket, payload);
    });

    // Chat events
    socket.on('join-chat', (payload: { projectId: string }) => {
        handleJoinChat(io, socket, payload);
    });

    socket.on('leave-chat', (payload: { projectId: string }) => {
        handleLeaveChat(socket, payload);
    });

    socket.on('chat:send', (payload: { projectId: string; message: { id: string; content: string; timestamp: string } }) => {
        handleChatSend(io, socket, payload);
    });

    // Disconnect
    socket.on('disconnect', () => {
        handleDisconnect(socket);
    });
}

// ============================================================================
// Shutdown
// ============================================================================

/**
 * Graceful shutdown - cleanup connections
 */
export async function shutdown(): Promise<void> {
    logger.info('Shutting down collab handler...');
    socketUsers.clear();
    socketRooms.clear();
    socketOrgRooms.clear();
    socketChatRooms.clear();
    logger.info('Collab handler shutdown complete');
}
