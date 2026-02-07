'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Bell,
  MessageSquare,
  Sparkles,
  Settings,
  LogOut,
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

export function Topbar() {
  const [searchFocus, setSearchFocus] = React.useState(false)
  const { user, logout } = useAuth()

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

  return (
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
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            className="relative text-foreground hover:bg-secondary group"
          >
            <Sparkles className="w-5 h-5" />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              className="absolute -bottom-2 -right-2 w-4 h-4 bg-indigo-500 rounded-full text-white text-xs flex items-center justify-center font-bold"
            >
              AI
            </motion.div>
          </Button>
        </motion.div>

        {/* Notifications */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            className="relative text-foreground hover:bg-secondary"
          >
            <Bell className="w-5 h-5" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
            />
          </Button>
        </motion.div>

        {/* Messages */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground hover:bg-secondary"
          >
            <MessageSquare className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
            </motion.div>
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
  )
}
