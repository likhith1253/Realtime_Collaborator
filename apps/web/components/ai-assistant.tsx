'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. I can help you improve your document, answer questions, and provide suggestions. What would you like help with?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(input),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 800)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const generateMockResponse = (userInput: string): string => {
    const responses: Record<string, string> = {
      default:
        'That\'s a great question! Based on the content of your document, I can help you improve clarity, structure, or engagement. What specific aspect would you like to focus on?',
      improve:
        'I can enhance your writing by:\n• Improving clarity and conciseness\n• Enhancing tone and voice\n• Strengthening arguments\n• Expanding key sections\n\nWhich would be most helpful?',
      summary:
        'Here\'s a brief summary of your document:\n\nYour document appears to cover key points about collaboration and productivity. Would you like me to:\n• Create a more detailed outline?\n• Suggest additional sections?\n• Improve the flow between ideas?',
      grammar:
        'I\'ve reviewed the grammar and structure. The document is well-written overall. A few suggestions:\n• Consider varying sentence length for better rhythm\n• Some transitions could be stronger\n• A few phrases could be more concise\n\nWould you like specific examples?',
    }

    const lowerInput = userInput.toLowerCase()
    if (lowerInput.includes('improve') || lowerInput.includes('better')) {
      return responses.improve
    }
    if (lowerInput.includes('summary') || lowerInput.includes('summarize')) {
      return responses.summary
    }
    if (
      lowerInput.includes('grammar') ||
      lowerInput.includes('check') ||
      lowerInput.includes('error')
    ) {
      return responses.grammar
    }

    return responses.default
  }

  return (
    <div className="flex h-full flex-col border-l border-border bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-lg font-semibold text-foreground">AI Assistant</h2>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-4 pr-4">
          <AnimatePresence initial={false} mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed',
                    message.role === 'user'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  )}
                >
                  <div className="whitespace-pre-wrap break-words">{message.content}</div>
                  <div
                    className={cn(
                      'mt-1 text-xs opacity-60',
                      message.role === 'user'
                        ? 'text-accent-foreground'
                        : 'text-secondary-foreground'
                    )}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
                <Loader2 className="h-4 w-4 animate-spin text-secondary-foreground" />
                <span className="text-sm text-secondary-foreground">AI is thinking...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border bg-background p-4">
        <div className="space-y-2">
          <Textarea
            ref={textareaRef}
            placeholder="Ask me anything... (Shift+Enter for new line)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="resize-none"
          />
          <div className="flex justify-end gap-2">
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              size="sm"
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
