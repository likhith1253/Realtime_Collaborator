import React, { useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim()) {
            onSend(message);
            setMessage('');
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="p-3 border-t border-zinc-700 bg-zinc-900/50 backdrop-blur-sm">
            <div className="flex gap-2">
                <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 bg-zinc-800 border-zinc-700 focus-visible:ring-indigo-500 text-zinc-100 placeholder:text-zinc-500"
                    disabled={disabled}
                    autoComplete="off"
                />
                <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={disabled || !message.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
