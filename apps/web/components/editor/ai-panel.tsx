'use client'

import React, { useState } from 'react'
import { Send, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const suggestedPrompts = [
  'Summarize this content',
  'Improve tone and clarity',
  'Add more detail',
  'Make it more concise',
]

export interface AIPanelProps {
  documentContent?: string
  onUpdateContent?: (content: string) => void
}

export function AIPanel({ documentContent = '', onUpdateContent }: AIPanelProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<Array<{ id: string; type: 'user' | 'assistant'; content: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (prompt.trim() && !isLoading) {
      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        type: 'user' as const,
        content: prompt,
      }
      setMessages((prev) => [...prev, userMessage])
      setPrompt('')
      setIsLoading(true)

      try {
        // Call AI Service
        const { aiService } = await import('@/lib/ai-service') // Dynamic import to avoid SSR issues if any, or just standard import
        const response = await aiService.chat(userMessage.content, documentContent)

        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant' as const,
          content: response,
        }
        setMessages((prev) => [...prev, assistantMessage])
      } catch (error) {
        setMessages((prev) => [...prev, {
          id: Date.now().toString(),
          type: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        }])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSuggestedPrompt = (suggPrompt: string) => {
    setPrompt(suggPrompt)
  }

  const handleInsert = (text: string) => {
    if (onUpdateContent) {
      onUpdateContent(documentContent + '\n' + text)
    }
  }

  const handleReplace = (text: string) => {
    if (onUpdateContent) {
      onUpdateContent(text)
    }
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <Sparkles className="w-4 h-4" />
        AI Assistant
      </Button>
    )
  }

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col h-full border-l-2 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">AI Assistant</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="h-6 w-6 p-0 hover:bg-muted"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="space-y-4 mt-8">
            <div className="flex justify-center">
              <div className="bg-primary/10 p-3 rounded-full">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              I can help you write, edit, and improve your document.
            </p>
            <div className="space-y-2 pt-2">
              {suggestedPrompts.map((suggPrompt) => (
                <button
                  key={suggPrompt}
                  onClick={() => handleSuggestedPrompt(suggPrompt)}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg border border-border hover:bg-secondary/80 transition-colors bg-background"
                >
                  {suggPrompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'
                }`}
            >
              <div
                className={`max-w-[90%] px-3 py-2 rounded-lg text-sm ${message.type === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-muted text-foreground rounded-bl-none'
                  }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>

              {message.type === 'assistant' && onUpdateContent && (
                <div className="flex gap-2 mt-1">
                  <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => handleInsert(message.content)}>
                    Insert
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={() => handleReplace(message.content)}>
                    Replace
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted px-4 py-2 rounded-lg rounded-bl-none text-sm text-muted-foreground animate-pulse">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border space-y-3 bg-muted/10">
        <div className="flex gap-2">
          <Input
            placeholder="Ask AI..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            disabled={isLoading}
            className="text-sm bg-background"
          />
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={!prompt.trim() || isLoading}
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
