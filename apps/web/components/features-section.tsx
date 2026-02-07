'use client'

import { motion } from 'framer-motion'
import DashboardShowcase from '@/components/dashboard-showcase'
import {
  Building2,
  FolderOpen,
  FileText,
  Users,
  Zap,
  Brain,
  Lock,
  BarChart3,
} from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      icon: Building2,
      title: 'Organizations',
      description: 'Manage multiple teams and projects under one unified workspace',
    },
    {
      icon: FolderOpen,
      title: 'Projects',
      description: 'Organize work into projects with customizable workflows',
    },
    {
      icon: FileText,
      title: 'Documents',
      description: 'Create and edit documents with rich formatting and comments',
    },
    {
      icon: Users,
      title: 'Presence Indicators',
      description: 'See who\'s online and working on documents in real-time',
    },
    {
      icon: Zap,
      title: 'Real-time Sync',
      description: 'Changes sync instantly across all team members seamlessly',
    },
    {
      icon: Brain,
      title: 'AI Assistance',
      description: 'Get intelligent suggestions, summaries, and writing help',
    },
    {
      icon: Lock,
      title: 'Security',
      description: 'Enterprise-grade encryption and permission controls',
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Track usage, activity, and team productivity metrics',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="features" className="py-20 sm:py-32 lg:py-40 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl sm:text-5xl font-bold">
            Everything You Need
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Comprehensive tools for collaborative work with built-in AI assistance
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative p-6 rounded-xl border border-border bg-card hover:bg-secondary hover:border-foreground/20 transition-all duration-300"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="mb-4 inline-flex p-3 rounded-lg bg-secondary group-hover:bg-foreground/10 transition-colors"
                >
                  <Icon className="w-6 h-6 text-foreground" />
                </motion.div>

                {/* Content */}
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>

                {/* Accent line */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-foreground to-transparent group-hover:w-full transition-all duration-300" />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Dashboard Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20"
        >
          <DashboardShowcase />
        </motion.div>
      </div>
    </section>
  )
}
