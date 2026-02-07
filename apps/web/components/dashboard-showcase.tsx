'use client'

import { motion } from 'framer-motion'
import {
  Building2,
  FolderOpen,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
} from 'lucide-react'

export default function DashboardShowcase() {
  const organizations = [
    { name: 'Design Team', icon: Building2, color: 'bg-blue-500' },
    { name: 'Engineering', icon: Building2, color: 'bg-purple-500' },
  ]

  const projects = [
    { name: 'Mobile App', docs: 12, color: 'bg-green-500' },
    { name: 'Web Platform', docs: 24, color: 'bg-orange-500' },
    { name: 'API Redesign', docs: 8, color: 'bg-red-500' },
  ]

  const documents = [
    { title: 'Q1 Product Roadmap', contributors: 3, edited: '2h ago', pinned: true },
    { title: 'Design System Updates', contributors: 5, edited: '1h ago', pinned: false },
    { title: 'API Documentation', contributors: 2, edited: '30m ago', pinned: false },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4 },
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-xl border border-border bg-card overflow-hidden shadow-xl"
    >
      {/* Header */}
      <div className="border-b border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Workspace</h3>
            <p className="text-sm text-muted-foreground">Design Team</p>
          </div>
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents, projects..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-foreground/20"
            disabled
          />
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 divide-x divide-border">
        {/* Left: Organizations */}
        <div className="p-6 border-r border-border lg:border-r">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Organizations
            </h4>
            <Plus className="w-4 h-4 cursor-pointer hover:text-foreground" />
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            {organizations.map((org, i) => (
              <motion.button
                key={i}
                variants={itemVariants}
                whileHover={{ x: 4 }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-sm"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${org.color}`} />
                  {org.name}
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Middle: Projects */}
        <div className="p-6 border-r border-border lg:border-r">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Projects
            </h4>
            <Plus className="w-4 h-4 cursor-pointer hover:text-foreground" />
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            {projects.map((project, i) => (
              <motion.button
                key={i}
                variants={itemVariants}
                whileHover={{ x: 4 }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-2 h-2 rounded-full ${project.color} flex-shrink-0`} />
                    <span className="text-sm truncate">{project.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {project.docs}
                  </span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Right: Documents */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </h4>
            <Plus className="w-4 h-4 cursor-pointer hover:text-foreground" />
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {documents.map((doc, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="p-3 rounded-lg border border-border hover:border-foreground/20 hover:bg-secondary transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <FileText className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                    <p className="text-sm font-medium truncate">{doc.title}</p>
                  </div>
                  <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2">
                  {/* Contributors */}
                  <div className="flex items-center gap-1">
                    <div className="flex -space-x-2">
                      {Array.from({ length: doc.contributors }).map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -2, 0] }}
                          transition={{
                            delay: i * 0.1,
                            duration: 2,
                            repeat: Infinity,
                          }}
                          className={`w-5 h-5 rounded-full border border-background flex items-center justify-center text-xs text-white font-bold ${
                            ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500', 'bg-orange-500'][
                              i % 5
                            ]
                          }`}
                        >
                          {i + 1}
                        </motion.div>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      +{doc.contributors}
                    </span>
                  </div>

                  {/* Timestamp */}
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {doc.edited}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
