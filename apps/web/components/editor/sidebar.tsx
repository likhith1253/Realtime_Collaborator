'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ChevronDown, Plus, FileText, Home, Presentation, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Mock data - no assumptions about real data
const mockProjects: Record<string, { name: string; documents: Array<{ id: string; title: string }> }> = {
  'project-1': {
    name: 'Marketing Campaign Q4',
    documents: [
      { id: 'doc-1', title: 'Campaign Brief' },
      { id: 'doc-2', title: 'Social Media Strategy' },
      { id: 'doc-3', title: 'Email Copy' },
      { id: 'doc-4', title: 'Budget Breakdown' },
    ],
  },
  'project-2': {
    name: 'Product Roadmap 2025',
    documents: [
      { id: 'doc-5', title: 'H1 Priorities' },
      { id: 'doc-6', title: 'Feature Backlog' },
      { id: 'doc-7', title: 'User Research Summary' },
    ],
  },
  'project-3': {
    name: 'Design System V2',
    documents: [
      { id: 'doc-8', title: 'Component Guidelines' },
      { id: 'doc-9', title: 'Color Palette' },
      { id: 'doc-10', title: 'Typography Rules' },
    ],
  },
}

export function Sidebar({ projectId }: { projectId?: string }) {
  const params = useParams()
  const currentProjectId = projectId || (params.projectId as string)
  const [isCreatingDoc, setIsCreatingDoc] = useState(false)
  const [newDocName, setNewDocName] = useState('')

  const currentProject = currentProjectId ? mockProjects[currentProjectId] : null

  const handleCreateDocument = () => {
    if (newDocName.trim() && currentProject) {
      setIsCreatingDoc(false)
      setNewDocName('')
      // In a real app, this would create a document in the backend
    }
  }

  return (
    <div className="w-64 border-r border-border bg-card flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
      </div>

      {/* Project Info */}
      {currentProject && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <h2 className="font-semibold text-sm truncate">{currentProject.name}</h2>
          </div>
        </div>
      )}

      {/* Documents List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <Link href={`/projects/${currentProjectId}/slides`}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-foreground mb-2"
            >
              <Presentation className="w-4 h-4 mr-2" />
              Slides
            </Button>
          </Link>
          <Link href={`/projects/${currentProjectId}/canvas`}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-foreground mb-2"
            >
              <Palette className="w-4 h-4 mr-2" />
              Canvas
            </Button>
          </Link>
          <Link href={`/projects/${currentProjectId}/documents`}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-foreground mb-4"
            >
              <FileText className="w-4 h-4 mr-2" />
              Documents
            </Button>
          </Link>

          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Recent Documents
          </h3>
          <div className="space-y-1">
            {currentProject?.documents.map((doc) => (
              <Link
                key={doc.id}
                href={`/documents/${doc.id}`}
                className="group relative"
              >
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors">
                  <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm truncate text-foreground group-hover:text-accent transition-colors">
                    {doc.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Create Document Section */}
      <div className="p-4 border-t border-border">
        {isCreatingDoc ? (
          <div className="space-y-2">
            <Input
              placeholder="Document name..."
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateDocument()
                if (e.key === 'Escape') {
                  setIsCreatingDoc(false)
                  setNewDocName('')
                }
              }}
              autoFocus
              className="text-sm"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleCreateDocument}
                className="flex-1"
              >
                Create
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsCreatingDoc(false)
                  setNewDocName('')
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsCreatingDoc(true)}
            className="w-full"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Document
          </Button>
        )}
      </div>
    </div>
  )
}
