'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Building2,
  FolderOpen,
  FileText,
  Plus,
  Search,
  Settings,
  MoreHorizontal,
  Bell,
  MessageSquare,
  LogOut,
  Users,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardLayout() {
  const [activeOrg, setActiveOrg] = useState('Design Team')
  const [activeProject, setActiveProject] = useState('Mobile App')

  const organizations = [
    { id: 1, name: 'Design Team', avatar: 'D', color: 'bg-blue-500' },
    { id: 2, name: 'Engineering', avatar: 'E', color: 'bg-purple-500' },
  ]

  const projects = [
    { id: 1, name: 'Mobile App', docs: 12, color: 'bg-green-500' },
    { id: 2, name: 'Web Platform', docs: 24, color: 'bg-orange-500' },
    { id: 3, name: 'API Redesign', docs: 8, color: 'bg-red-500' },
  ]

  const documents = [
    {
      id: 1,
      title: 'Q1 Product Roadmap',
      description: 'Planning for next quarter',
      contributors: ['A', 'S', 'J'],
      edited: '2h ago',
      pinned: true,
      colors: ['bg-blue-500', 'bg-purple-500', 'bg-pink-500'],
    },
    {
      id: 2,
      title: 'Design System Updates',
      description: 'Component library refresh',
      contributors: ['A', 'S', 'J', 'M', 'K'],
      edited: '1h ago',
      pinned: false,
      colors: [
        'bg-blue-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-green-500',
        'bg-orange-500',
      ],
    },
    {
      id: 3,
      title: 'API Documentation',
      description: 'REST endpoints reference',
      contributors: ['A', 'S'],
      edited: '30m ago',
      pinned: false,
      colors: ['bg-blue-500', 'bg-purple-500'],
    },
  ]

  const currentUsers = [
    { name: 'Alex Johnson', avatar: 'A', status: 'editing', color: 'bg-blue-500' },
    { name: 'Sam Chen', avatar: 'S', status: 'viewing', color: 'bg-purple-500' },
    { name: 'Jordan Lee', avatar: 'J', status: 'idle', color: 'bg-pink-500' },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-64 border-r border-border bg-secondary/30 flex flex-col overflow-hidden"
      >
        {/* Top: Logo & Organization Switcher */}
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex items-center gap-2 font-bold">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
              C
            </div>
            <span>Collab</span>
          </div>

          {/* Org Dropdown */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">ORGANIZATION</p>
            <select
              value={activeOrg}
              onChange={(e) => setActiveOrg(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-card border border-border cursor-pointer hover:border-foreground/20 transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20"
            >
              {organizations.map((org) => (
                <option key={org.id} value={org.name}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Middle: Projects */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground">PROJECTS</p>
              <Plus className="w-4 h-4 cursor-pointer hover:text-foreground" />
            </div>

            <div className="space-y-1">
              {projects.map((project) => (
                <motion.button
                  key={project.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setActiveProject(project.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeProject === project.name
                      ? 'bg-card text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-2 h-2 rounded-full ${project.color} flex-shrink-0`} />
                      <span className="truncate">{project.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {project.docs}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Team Members */}
          <div className="space-y-2 pt-4 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground">ONLINE NOW</p>
            <div className="space-y-2">
              {currentUsers.map((user, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ delay: i * 0.2, duration: 3, repeat: Infinity }}
                  className="flex items-center gap-2 p-2 rounded-lg"
                >
                  <div className={`w-6 h-6 rounded-full ${user.color} flex items-center justify-center text-xs text-white font-bold`}>
                    {user.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.status}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom: User & Settings */}
        <div className="p-4 border-t border-border space-y-2">
          <Button variant="ghost" className="w-full justify-start text-sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm text-destructive hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="border-b border-border bg-card/50 backdrop-blur px-8 py-4 flex items-center justify-between"
        >
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-foreground/20"
                disabled
              />
            </div>
          </div>

          <div className="flex items-center gap-4 ml-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="p-2 hover:bg-secondary rounded-lg transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
            </motion.button>

            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs text-white font-bold">
              U
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold mb-2">{activeProject}</h1>
              <p className="text-muted-foreground">
                {documents.length} documents • Shared with team
              </p>
            </div>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {documents.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group p-6 rounded-xl border border-border bg-card hover:border-foreground/20 hover:bg-secondary transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                    <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-semibold mb-1">{doc.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {doc.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    {/* Contributors */}
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {doc.colors.map((color, j) => (
                          <motion.div
                            key={j}
                            animate={{ y: [0, -2, 0] }}
                            transition={{
                              delay: j * 0.1,
                              duration: 2,
                              repeat: Infinity,
                            }}
                            className={`w-6 h-6 rounded-full border-2 border-card flex items-center justify-center text-xs text-white font-bold ${color}`}
                          >
                            {doc.contributors[j]}
                          </motion.div>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {doc.contributors.length}
                      </span>
                    </div>

                    {/* Edited time */}
                    <span className="text-xs text-muted-foreground">
                      {doc.edited}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* AI Assistant Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 p-6 rounded-xl border border-border bg-gradient-to-br from-card via-card to-secondary"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-foreground to-muted-foreground flex items-center justify-center text-xs text-background font-bold">
                  AI
                </div>
                <h3 className="font-semibold">Collab AI Assistant</h3>
                <span className="ml-auto text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-600 dark:text-green-400">
                  Ready
                </span>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Get instant help with writing, summarizing, and analyzing documents.
              </p>

              <div className="flex gap-2">
                {[
                  'Summarize',
                  'Improve writing',
                  'Brainstorm ideas',
                  'Ask question',
                ].map((action) => (
                  <Button
                    key={action}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-transparent"
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
