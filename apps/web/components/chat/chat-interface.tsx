import React from 'react';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';
import { useChat } from '@/hooks/use-chat';
import { Loader2 } from 'lucide-react';

interface ChatInterfaceProps {
    projectId: string;
}

export function ChatInterface({ projectId }: ChatInterfaceProps) {
    const { messages, sendMessage, isConnected } = useChat(projectId);

    return (
        <div className="flex flex-col h-[400px] w-full">
            {!isConnected && (
                <div className="bg-amber-500/10 text-amber-500 text-xs px-3 py-1 text-center border-b border-amber-500/20">
                    Connecting to chat...
                </div>
            )}

            <MessageList messages={messages} />

            <ChatInput
                onSend={sendMessage}
                disabled={!isConnected}
            />
        </div>
    );
}
