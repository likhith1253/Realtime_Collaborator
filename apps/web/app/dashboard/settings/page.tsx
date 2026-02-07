'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>

            <div className="space-y-6">
                <div className="p-6 border border-border rounded-xl bg-card">
                    <h2 className="text-lg font-semibold mb-4">Profile Settings</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                                    defaultValue="Alex Johnson"
                                    disabled
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                                    defaultValue="alex@example.com"
                                    disabled
                                />
                            </div>
                        </div>
                        <Button disabled>Save Changes</Button>
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
