'use client'

import React from 'react'

export default function CanvasPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🎨</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Canvas</h1>
            <p className="text-muted-foreground max-w-md">
                Brainstorm and collaborate on an infinite canvas. This feature is coming soon!
            </p>
        </div>
    )
}
