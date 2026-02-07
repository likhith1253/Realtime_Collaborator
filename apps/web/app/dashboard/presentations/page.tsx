'use client'

import React from 'react'

export default function PresentationsPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">📊</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Presentations</h1>
            <p className="text-muted-foreground max-w-md">
                Create and share stunning presentations with your team. This feature is coming soon!
            </p>
        </div>
    )
}
