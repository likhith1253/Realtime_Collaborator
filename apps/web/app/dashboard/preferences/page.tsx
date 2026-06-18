'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function PreferencesPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [desktopNotifications, setDesktopNotifications] = useState(false)
  const [theme, setTheme] = useState('system')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1000)
  }

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl font-bold mb-2">User Preferences</h1>
        <p className="text-muted-foreground">
          Customize your experience, notifications, and visual appearance.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Application Preferences</CardTitle>
            <CardDescription>Manage how you receive alerts and view the app.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notifications</h3>
              <div className="flex items-center justify-between border-b pb-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive daily summaries and important alerts via email.
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Desktop Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get push notifications on your desktop for real-time updates.
                  </p>
                </div>
                <Switch
                  checked={desktopNotifications}
                  onCheckedChange={setDesktopNotifications}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Appearance</h3>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Application Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred visual theme.
                  </p>
                </div>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-6">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
