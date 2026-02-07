import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
    joinChat,
    leaveChat,
    sendChatMessage,
    onChatMessage,
    getSocket
} from '@/lib/socket';

export interface Message {
    id: string;
    sender: {
        id: string;
        name: string;
        avatar: string | null;
    };
    content: string;
    timestamp: string;
    isOwn: boolean;
}

export function useChat(projectId: string | null) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const joinedProjectRef = useRef<string | null>(null);

    // Initial connection and room joining
    useEffect(() => {
        if (!projectId || !user) return;

        const socket = getSocket();
        if (socket?.connected) {
            setIsConnected(true);
        }

        // Join chat room
        if (joinedProjectRef.current !== projectId) {
            joinChat(projectId);
            joinedProjectRef.current = projectId;
        }

        const handleConnect = () => setIsConnected(true);
        const handleDisconnect = () => setIsConnected(false);

        socket?.on('connect', handleConnect);
        socket?.on('disconnect', handleDisconnect);

        return () => {
            if (projectId) {
                leaveChat(projectId);
                joinedProjectRef.current = null;
            }
            socket?.off('connect', handleConnect);
            socket?.off('disconnect', handleDisconnect);
        };
    }, [projectId, user]);

    // Listen for new messages
    useEffect(() => {
        if (!projectId) return;

        const cleanup = onChatMessage((data) => {
            setMessages((prev) => {
                // Deduplicate based on ID
                if (prev.some(m => m.id === data.id)) return prev;

                const newMessage: Message = {
                    id: data.id,
                    sender: data.sender,
                    content: data.content,
                    timestamp: data.timestamp,
                    isOwn: user?.userId === data.sender.id
                };
                return [...prev, newMessage];
            });
        });

        return cleanup;
    }, [projectId, user?.userId]);

    const sendMessage = useCallback((content: string) => {
        if (!projectId || !user || !content.trim()) return;

        const tempId = crypto.randomUUID();
        const timestamp = new Date().toISOString();

        const messagePayload = {
            id: tempId,
            content,
            timestamp
        };

        // Optimistic update? 
        // actually, backend broadcasts to sender too, so we might want to wait or handle dedup. 
        // The handler in backend: io.to(roomName).emit('message:new', ...);
        // This means we will receive our own message back. 
        // We can just send it and let the socket event update the UI to avoid complex state management for now,
        // or we can optimistically add it. Given the requirement for "Realtime", waiting for RTT is fine for MVP.
        // But for better UX, let's just rely on the socket callback to ensure consistency.

        sendChatMessage(projectId, messagePayload);
    }, [projectId, user]);

    return {
        messages,
        sendMessage,
        isConnected
    };
}
