import React, { useEffect, useRef } from 'react';
import { MessageBubble } from './message-bubble';
import { Message } from '@/hooks/use-chat';
import { MessageSquareOff } from 'lucide-react';

interface MessageListProps {
    messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (messages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="w-12 h-12 bg-zinc-800/50 rounded-full flex items-center justify-center mb-3">
                    <MessageSquareOff className="w-6 h-6 text-zinc-500" />
                </div>
                <h4 className="text-zinc-300 font-medium mb-1">No messages yet</h4>
                <p className="text-xs text-zinc-500 max-w-[200px]">
                    Start the conversation by sending a message to your team.
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
                <MessageBubble
                    key={msg.id}
                    sender={msg.sender}
                    content={msg.content}
                    timestamp={msg.timestamp}
                    isOwn={msg.isOwn}
                />
            ))}
            <div ref={bottomRef} />
        </div>
    );
}
