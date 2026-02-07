'use client'

import React, { useState } from 'react'
import { CanvasEditor } from '@/components/editor/canvas-editor'
import { AppShell } from '@/components/app-shell'
import { ProtectedRoute } from '@/components/protected-route'

// Mock document ID for demo
const CANVAS_DOCUMENT_ID = 'canvas-demo-1'

export default function CanvasPage() {
  // Initialize with localStorage data
  const initialCanvasData = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`canvas-${CANVAS_DOCUMENT_ID}`) || ''
    }
    return ''
  })[0]

  // Save canvas data to localStorage (mock backend)
  const handleSave = async (data: string) => {
    try {
      localStorage.setItem(`canvas-${CANVAS_DOCUMENT_ID}`, data)
      console.log('Canvas saved successfully')
    } catch (error) {
      console.error('Failed to save canvas:', error)
      throw error
    }
  }

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="h-full">
          <CanvasEditor
            documentId={CANVAS_DOCUMENT_ID}
            initialCanvasData={initialCanvasData}
            onSave={handleSave}
          />
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}
