import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface MessageBubbleProps {
    sender: {
        name: string;
        avatar: string | null;
    };
    content: string;
    timestamp: string;
    isOwn: boolean;
}

export function MessageBubble({ sender, content, timestamp, isOwn }: MessageBubbleProps) {
    return (
        <div className={cn("flex w-full gap-2 mb-4", isOwn ? "flex-row-reverse" : "flex-row")}>
            <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src={sender.avatar || undefined} />
                <AvatarFallback className={isOwn ? "bg-indigo-500 text-white" : "bg-zinc-700"}>
                    {sender.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <div className={cn(
                "flex flex-col max-w-[75%]",
                isOwn ? "items-end" : "items-start"
            )}>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-zinc-400">
                        {isOwn ? 'You' : sender.name}
                    </span>
                    <span className="text-[10px] text-zinc-600">
                        {format(new Date(timestamp), 'HH:mm')}
                    </span>
                </div>

                <div className={cn(
                    "px-3 py-2 rounded-lg text-sm break-words",
                    isOwn
                        ? "bg-indigo-600 text-white rounded-tr-none"
                        : "bg-zinc-800 text-zinc-200 rounded-tl-none"
                )}>
                    {content}
                </div>
            </div>
        </div>
    );
}
