/**
 * Collaboration Handler
 * Simple real-time document content sync using Socket.io
 * 
 * Events:
 * - join-document: Client joins a document room
 * - document-update: Content sync between clients
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

// ... existing helpers ...

function getOrgRoomName(orgId: string): string {
    return `org:${orgId}`;
}

// ... existing handlers ...

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

// ... update handleDisconnect ...

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

    socketUsers.delete(socket.id);
    socketRooms.delete(socket.id);
    socketOrgRooms.delete(socket.id);
    logger.info(`User ${user?.email || 'unknown'} disconnected`);
}

// ... update setupSocketHandlers ...

export function setupSocketHandlers(io: Server, socket: Socket): void {
    // ... existing events ...

    // Join organization
    socket.on('join-organization', (payload: { organizationId: string }) => {
        handleJoinOrganization(io, socket, payload);
    });

    // ... existing events ...
}

/**
 * Graceful shutdown - cleanup connections
 */
export async function shutdown(): Promise<void> {
    logger.info('Shutting down collab handler...');
    socketUsers.clear();
    socketRooms.clear();
    logger.info('Collab handler shutdown complete');
}
