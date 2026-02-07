'use client'

import React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Bell,
  MessageSquare,
  Sparkles,
  Settings,
  LogOut,
  BellOff,
  MessageSquareOff,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/auth-context'
import { useParams } from 'next/navigation'
import { ChatInterface } from './chat/chat-interface'

// Portal wrapper for dropdowns
function DropdownPortal({ children, isOpen }: { children: React.ReactNode; isOpen: boolean }) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted || !isOpen) return null

  return createPortal(children, document.body)
}

export function Topbar() {
  const [searchFocus, setSearchFocus] = React.useState(false)
  const [activePanel, setActivePanel] = React.useState<'ai' | 'notifications' | 'messages' | null>(null)
  const [panelPosition, setPanelPosition] = React.useState({ top: 0, right: 0 })
  const { user, logout } = useAuth()
  const params = useParams()

  const aiButtonRef = React.useRef<HTMLButtonElement>(null)
  const notificationButtonRef = React.useRef<HTMLButtonElement>(null)
  const messagesButtonRef = React.useRef<HTMLButtonElement>(null)

  const handleLogout = () => {
    logout()
  }

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const openPanel = (panel: 'ai' | 'notifications' | 'messages', buttonRef: React.RefObject<HTMLButtonElement | null>) => {
    if (activePanel === panel) {
      setActivePanel(null)
      return
    }

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPanelPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      })
    }
    setActivePanel(panel)

    // Auto-close AI tooltip after 2 seconds
    if (panel === 'ai') {
      setTimeout(() => setActivePanel(null), 2000)
    }
  }

  // Close panel when clicking outside
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-topbar-panel]') && !target.closest('[data-topbar-trigger]')) {
        setActivePanel(null)
      }
    }

    if (activePanel) {
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
    }
  }, [activePanel])

  return (
    <>
      <div className="h-16 flex items-center justify-between px-6 gap-4">
        {/* Left: Search */}
        <div className="flex-1 max-w-md">
          <motion.div
            animate={{
              boxShadow: searchFocus
                ? '0 0 0 2px rgb(99, 102, 241)'
                : '0 0 0 1px rgb(34, 34, 34)',
            }}
            className="relative rounded-lg bg-secondary border border-border transition-all duration-200"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search documents, projects..."
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              className="pl-10 h-10 bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
            />
          </motion.div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* AI Assistant */}
          <Button
            ref={aiButtonRef}
            variant="ghost"
            size="icon"
            className="relative text-foreground hover:bg-secondary"
            onClick={() => openPanel('ai', aiButtonRef)}
            data-topbar-trigger="ai"
          >
            <Sparkles className="w-5 h-5" />
            <span className="absolute -bottom-2 -right-2 w-4 h-4 bg-indigo-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
              AI
            </span>
          </Button>

          {/* Notifications */}
          <Button
            ref={notificationButtonRef}
            variant="ghost"
            size="icon"
            className="relative text-foreground hover:bg-secondary"
            onClick={() => openPanel('notifications', notificationButtonRef)}
            data-topbar-trigger="notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </Button>

          {/* Messages */}
          <Button
            ref={messagesButtonRef}
            variant="ghost"
            size="icon"
            className="text-foreground hover:bg-secondary"
            onClick={() => openPanel('messages', messagesButtonRef)}
            data-topbar-trigger="messages"
          >
            <MessageSquare className="w-5 h-5" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-10 px-2 gap-2 text-foreground hover:bg-secondary"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=user"} />
                  <AvatarFallback className="bg-indigo-500 text-white">
                    {user ? getUserInitials(user.name) : 'JD'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-sm font-medium">{user?.name || 'Guest'}</span>
                  {user?.organization?.name ? (
                    <span className="text-xs text-muted-foreground">
                      {user.organization.name}
                    </span>
                  ) : null}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Preferences</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Portaled Dropdown Panels */}
      <DropdownPortal isOpen={activePanel === 'ai'}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed z-[9999] px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl"
          style={{ top: panelPosition.top, right: panelPosition.right }}
          data-topbar-panel="ai"
        >
          <p className="flex items-center gap-2 text-sm text-white whitespace-nowrap">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            AI assistant coming soon
          </p>
        </motion.div>
      </DropdownPortal>

      <DropdownPortal isOpen={activePanel === 'notifications'}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed z-[9999] w-80 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-4"
          style={{ top: panelPosition.top, right: panelPosition.right }}
          data-topbar-panel="notifications"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </h4>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-zinc-400 hover:text-white"
              onClick={() => setActivePanel(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <BellOff className="w-10 h-10 text-zinc-500 mb-3" />
            <p className="text-sm text-zinc-300">No notifications yet</p>
            <p className="text-xs text-zinc-500 mt-1">
              We&apos;ll notify you when something happens
            </p>
          </div>
        </motion.div>
      </DropdownPortal>

      <DropdownPortal isOpen={activePanel === 'messages'}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed z-[9999] w-80 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden flex flex-col"
          style={{ top: panelPosition.top, right: panelPosition.right, height: '500px' }}
          data-topbar-panel="messages"
        >
          <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900 z-10">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Messages
            </h4>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-zinc-400 hover:text-white"
              onClick={() => setActivePanel(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-hidden relative bg-zinc-900/50">
            {params.id ? (
              <ChatInterface projectId={params.id as string} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <MessageSquareOff className="w-10 h-10 text-zinc-500 mb-3" />
                <p className="text-sm text-zinc-300">No project selected</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Open a project to start chatting with your team
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </DropdownPortal>
    </>
  )
}
