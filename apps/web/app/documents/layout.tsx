'use client'

import React from 'react'
import { ProtectedRoute } from '@/components/protected-route'

export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="h-screen bg-background">{children}</div>
    </ProtectedRoute>
  )
}
