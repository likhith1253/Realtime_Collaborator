'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Send, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    joinChat,
    leaveChat,
    sendChatMessage,
    onChatMessage,
    onJoinedChat
} from '@/lib/socket'
import { useAuth } from '@/lib/auth-context'

interface Message {
    id: string
    sender: {
        id: string
        name: string
        avatar: string | null
    }
    content: string
    timestamp: string
}

interface ChatPanelProps {
    projectId: string
}

export function ChatPanel({ projectId }: ChatPanelProps) {
    const { user } = useAuth()
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState('')
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!projectId || !user) return

        // Join chat room
        joinChat(projectId)

        // Listen for new messages
        const cleanupMessage = onChatMessage((data) => {
            setMessages((prev) => [...prev, data])
            // Auto-scroll to bottom
            setTimeout(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
                }
            }, 100)
        })

        return () => {
            leaveChat(projectId)
            cleanupMessage()
        }
    }, [projectId, user])

    const handleSendMessage = () => {
        if (!inputValue.trim() || !user) return

        const newMessage = {
            id: crypto.randomUUID(),
            content: inputValue,
            timestamp: new Date().toISOString()
        }

        sendChatMessage(projectId, newMessage)
        setInputValue('')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <div className="flex flex-col h-full bg-background border-l border-border w-80">
            <div className="p-4 border-b border-border">
                <h3 className="font-semibold">Team Chat</h3>
            </div>

            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center text-muted-foreground text-sm py-8">
                            No messages yet. Start the conversation!
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.sender.id === user?.id
                            return (
                                <div
                                    key={msg.id}
                                    className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={msg.sender.avatar || ''} />
                                        <AvatarFallback>
                                            {msg.sender.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div
                                        className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'
                                            }`}
                                    >
                                        <div className="flex items-center gap-1 mb-1">
                                            <span className="text-xs font-medium text-foreground">
                                                {msg.sender.name}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">
                                                {new Date(msg.timestamp).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <div
                                            className={`px-3 py-2 rounded-lg text-sm ${isMe
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted text-foreground'
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className="flex-1"
                    />
                    <Button size="icon" onClick={handleSendMessage} disabled={!inputValue.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
