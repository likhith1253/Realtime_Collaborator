/**
 * Socket.io client utility for real-time document collaboration.
 * Connects to collab-service with JWT authentication.
 */

import { io, Socket } from 'socket.io-client';
import { getAuthToken } from './auth';

// Collab service URL from environment
const COLLAB_URL = process.env.NEXT_PUBLIC_COLLAB_URL || 'http://localhost:3003';

// Singleton socket instance
let socket: Socket | null = null;

/**
 * Get or create the socket connection.
 * Authenticates using the stored auth token.
 */
export function getSocket(): Socket | null {
    // Only run on client
    if (typeof window === 'undefined') return null;

    // Return existing socket instance
    if (socket) return socket;

    const token = getAuthToken();
    if (!token) {
        console.warn('[Socket] No auth token available');
        return null;
    }

    // Create new socket connection with auth
    socket = io(COLLAB_URL, {
        auth: {
            token: token,
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
        console.log('[Socket] Connected:', socket?.id);
    });

    socket.on('connect_error', (error) => {
        // Only log in development, not in production
        if (process.env.NODE_ENV === 'development') {
            console.log('[Socket] Connection error:', error.message);
        }
    });

    socket.on('disconnect', (reason) => {
        console.log('[Socket] Disconnected:', reason);
    });

    return socket;
}

/**
 * Disconnect the socket connection.
 */
export function disconnectSocket(): void {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}

/**
 * Join a document room for real-time collaboration.
 */
export function joinDocument(documentId: string): void {
    const s = getSocket();
    if (s) {
        s.emit('join-document', { documentId });
    }
}

/**
 * Emit a document content update to other clients.
 */
export function emitDocumentUpdate(documentId: string, content: string): void {
    const s = getSocket();
    if (s) {
        s.emit('document-update', { documentId, content });
    }
}

/**
 * Listen for document updates from other clients.
 * Returns cleanup function for useEffect.
 */
export function onDocumentUpdate(
    callback: (data: { content: string }) => void
): () => void {
    const s = getSocket();
    if (!s) return () => { };

    s.on('document-update', callback);
    return () => {
        s.off('document-update', callback);
    };
}

/**
 * Join a slide room for real-time collaboration.
 */
export function joinSlide(slideId: string): void {
    const s = getSocket();
    if (s) {
        s.emit('join-slide', { slideId });
    }
}

/**
 * Emit a slide content update to other clients.
 */
export function emitSlideUpdate(slideId: string, title?: string, content?: string): void {
    const s = getSocket();
    if (s) {
        s.emit('slide-update', { slideId, title, content });
    }
}

/**
 * Listen for slide updates from other clients.
 * Returns cleanup function for useEffect.
 */
export function onSlideUpdate(
    callback: (data: { title?: string; content?: string }) => void
): () => void {
    const s = getSocket();
    if (!s) return () => { };

    s.on('slide-update', callback);
    return () => {
        s.off('slide-update', callback);
    };
}

/**
 * Emit a canvas update to other clients.
 */
export function emitCanvasUpdate(documentId: string, canvasData: string): void {
    const s = getSocket();
    if (s) {
        s.emit('canvas-update', { documentId, canvasData });
    }
}

/**
 * Listen for canvas updates from other clients.
 * Returns cleanup function for useEffect.
 */
export function onCanvasUpdate(
    callback: (data: { canvasData: string }) => void
): () => void {
    const s = getSocket();
    if (!s) return () => { };

    s.on('canvas-update', callback);
    return () => {
        s.off('canvas-update', callback);
    };
}

export interface OnlineUser {
    userId: string;
    email: string;
    name: string;
}

/**
 * Join an organization room for presence.
 */
export function joinOrganization(organizationId: string): void {
    const s = getSocket();
    if (s) {
        s.emit('join-organization', { organizationId });
    }
}

/**
 * Listen for when a user comes online.
 */
export function onUserOnline(callback: (user: OnlineUser) => void): () => void {
    const s = getSocket();
    if (!s) return () => { };
    s.on('user-online', callback);
    return () => {
        s.off('user-online', callback);
    };
}

/**
 * Listen for when a user goes offline.
 */
export function onUserOffline(callback: (data: { userId: string }) => void): () => void {
    const s = getSocket();
    if (!s) return () => { };
    s.on('user-offline', callback);
    return () => {
        s.off('user-offline', callback);
    };
}

/**
 * Listen for initial online users list when joining organization.
 */
export function onJoinedOrganization(callback: (data: { onlineUsers: OnlineUser[] }) => void): () => void {
    const s = getSocket();
    if (!s) return () => { };
    s.on('joined-organization', callback);
    return () => {
        s.off('joined-organization', callback);
    };
}

/**
 * Join a project chat room.
 */
export function joinChat(projectId: string): void {
    const s = getSocket();
    if (s) {
        s.emit('join-chat', { projectId });
    }
}

/**
 * Leave a project chat room.
 */
export function leaveChat(projectId: string): void {
    const s = getSocket();
    if (s) {
        s.emit('leave-chat', { projectId });
    }
}

/**
 * Send a chat message to a project room.
 */
export function sendChatMessage(projectId: string, message: { id: string; content: string; timestamp: string }): void {
    const s = getSocket();
    if (s) {
        s.emit('chat:send', { projectId, message });
    }
}

/**
 * Listen for new chat messages.
 */
export function onChatMessage(
    callback: (data: { id: string; sender: { id: string; name: string; avatar: string | null }; content: string; timestamp: string }) => void
): () => void {
    const s = getSocket();
    if (!s) return () => { };

    s.on('message:new', callback);
    return () => {
        s.off('message:new', callback);
    };
}

/**
 * Listen for when the client has successfully joined the chat.
 */
export function onJoinedChat(
    callback: (data: { projectId: string; roomName: string }) => void
): () => void {
    const s = getSocket();
    if (!s) return () => { };

    s.on('joined-chat', callback);
    return () => {
        s.off('joined-chat', callback);
    };
}

