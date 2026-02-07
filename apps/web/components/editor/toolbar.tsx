'use client'

import React, { useState, useEffect } from 'react'
import { Check, Cloud, AlertCircle, Users, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error'

export function EditorToolbar() {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Simulate save status changes
  const handleSave = () => {
    setSaveStatus('saving')
    setTimeout(() => {
      setSaveStatus('saved')
      setLastSaved(new Date())
    }, 500)
  }

  // Handle Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const getSaveStatusLabel = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...'
      case 'saved':
        return lastSaved
          ? `Saved ${formatTime(lastSaved)}`
          : 'All changes saved'
      case 'unsaved':
        return 'Unsaved changes'
      case 'error':
        return 'Save failed'
      default:
        return 'All changes saved'
    }
  }

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <Cloud className="w-4 h-4 animate-pulse" />
      case 'saved':
        return <Check className="w-4 h-4 text-green-500" />
      case 'unsaved':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Check className="w-4 h-4 text-green-500" />
    }
  }

  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: Save Status */}
        <div className="flex items-center gap-2">
          {getSaveStatusIcon()}
          <span className="text-sm text-muted-foreground">
            {getSaveStatusLabel()}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className="gap-2"
          >
            <Cloud className="w-4 h-4" />
            Save
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <Users className="w-4 h-4" />
            <span className="text-xs">2 collaborators</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <Copy className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>
    </div>
  )
}

function formatTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins === 0) return 'just now'
  if (diffMins === 1) return '1m ago'
  if (diffMins < 60) return `${diffMins}m ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours === 1) return '1h ago'
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}
