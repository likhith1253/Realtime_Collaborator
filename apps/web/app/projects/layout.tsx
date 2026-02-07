'use client'

import React from 'react'
import { Sidebar } from '@/components/editor/sidebar'
import { ProtectedRoute } from '@/components/protected-route'

export default function ProjectsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ projectId?: string }>
}) {
  const [projectId, setProjectId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      // Sanitize projectId to ensure Sidebar links are correct even if URL is malformed
      setProjectId(resolvedParams.projectId?.replace(/%20| /g, '-') || null)
    }
    resolveParams()
  }, [params])

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar projectId={projectId || undefined} />
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  )
}
