'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'

export default function SettingsPage() {
    const { user, token, updateUser } = useAuth()
    const [name, setName] = useState('')
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    // Load user data when component mounts or user changes
    useEffect(() => {
        if (user) {
            setName(user.name || '')
        }
    }, [user])

    const handleSave = async () => {
        if (!token) {
            setMessage({ type: 'error', text: 'Not authenticated' })
            return
        }

        setSaving(true)
        setMessage(null)

        try {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
            const response = await fetch(`${apiBase}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ full_name: name }),
            })

            if (response.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' })
                // Update local user state immediately
                updateUser({ name })
            } else {
                const error = await response.json().catch(() => ({}))
                setMessage({ type: 'error', text: error.error || 'Failed to update profile' })
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Network error. Please try again.' })
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>

            <div className="space-y-6">
                <div className="p-6 border border-border rounded-xl bg-card">
                    <h2 className="text-lg font-semibold mb-4">Profile Settings</h2>

                    {message && (
                        <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success'
                            ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                            : 'bg-red-500/10 text-red-500 border border-red-500/20'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-muted-foreground"
                                    value={user?.email || ''}
                                    disabled
                                    title="Email cannot be changed"
                                />
                            </div>
                        </div>
                        <Button
                            onClick={handleSave}
                            disabled={saving || !name.trim()}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>

                <div className="p-6 border border-border rounded-xl bg-card">
                    <h2 className="text-lg font-semibold mb-4">Preferences</h2>
                    <div className="flex items-center justify-between py-2">
                        <span className="text-sm">Email Notifications</span>
                        <div className="w-10 h-6 bg-primary/20 rounded-full relative cursor-not-allowed">
                            <div className="absolute top-1 left-1 w-4 h-4 bg-primary rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <span className="text-sm">Dark Mode</span>
                        <div className="w-10 h-6 bg-primary/20 rounded-full relative cursor-not-allowed">
                            <div className="absolute top-1 left-1 w-4 h-4 bg-primary rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
