'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

/**
 * Protects routes by validating user authentication via auth context.
 * Redirects to /auth/sign-in if not authenticated.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { isAuthenticated, loading } = useAuth()

    useEffect(() => {
        console.log('[ProtectedRoute] Check:', { loading, isAuthenticated, path: window.location.pathname })
        // Only redirect if done loading and not authenticated
        if (!loading && !isAuthenticated) {
            console.log('[ProtectedRoute] Redirecting to sign-in')
            router.replace('/auth/sign-in')
        }
    }, [loading, isAuthenticated, router])

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    return <>{children}</>
}

