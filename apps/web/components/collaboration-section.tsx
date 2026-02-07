'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MessageCircle, Send, Plus, ArrowRight } from 'lucide-react'

export default function CollaborationSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
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
    <section id="collaboration" className="py-20 sm:py-32 lg:py-40 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-16"
        >
          {/* Real-time Collaboration */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">
                Real-time Collaboration
              </h2>
              <p className="text-lg text-muted-foreground">
                See your team's cursors, edits, and presence indicators as they work. Know exactly who's editing what and when.
              </p>
              <ul className="space-y-3">
                {[
                  'Live cursor tracking for all team members',
                  'Instant synchronization of changes',
                  'Presence indicators with user avatars',
                  'Activity logs for every document change',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Learn More
              </Button>
            </div>

            {/* Collaboration Demo */}
            <motion.div
              whileHover={{ y: -4 }}
              className="relative"
            >
              <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
                {/* Document Preview */}
                <div className="space-y-4 mb-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Project Brief.doc</h3>
                    <div className="flex gap-1">
                      {[
                        { name: 'Alex', color: 'bg-blue-500' },
                        { name: 'Sam', color: 'bg-purple-500' },
                        { name: 'Jordan', color: 'bg-pink-500' },
                      ].map((user, i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ delay: i * 0.2, duration: 2, repeat: Infinity }}
                          className={`w-8 h-8 ${user.color} rounded-full border-2 border-background flex items-center justify-center text-xs text-white font-bold -ml-2 first:ml-0`}
                          title={user.name}
                        >
                          {user.name[0]}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Presence cursors visualization */}
                  <div className="text-sm text-muted-foreground space-y-3 pt-4 border-t border-border">
                    <div className="p-3 rounded bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
                      <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Alex is editing...</p>
                      <p className="text-xs">{'We should focus on the user experience first...'}</p>
                    </div>

                    <div className="p-3 rounded bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900">
                      <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1">Sam commented</p>
                      <p className="text-xs">{'Good point! Let\'s add a user testing phase.'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-foreground/5 to-transparent rounded-full blur-3xl" />
            </motion.div>
          </motion.div>

          {/* AI Assistance */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* AI Demo */}
            <motion.div
              whileHover={{ y: -4 }}
              className="relative order-2 lg:order-1"
            >
              <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-foreground to-muted-foreground flex items-center justify-center text-xs text-background font-bold">
                      AI
                    </div>
                    <span className="text-sm font-medium">Collab AI</span>
                  </div>

                  {/* Chat messages */}
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="max-w-xs">
                        <div className="px-3 py-2 rounded-lg bg-secondary text-sm">
                          Summarize this section
                        </div>
                      </div>
                    </div>

                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex gap-2"
                    >
                      <div className="w-8 h-8" />
                      <div className="max-w-xs">
                        <div className="px-3 py-2 rounded-lg bg-muted text-sm">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            Thinking
                            <span className="flex gap-1">
                              <span className="w-1 h-1 rounded-full bg-muted-foreground animate-bounce" />
                              <span className="w-1 h-1 rounded-full bg-muted-foreground animate-bounce delay-100" />
                              <span className="w-1 h-1 rounded-full bg-muted-foreground animate-bounce delay-200" />
                            </span>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Input */}
                  <div className="flex gap-2 pt-4 border-t border-border">
                    <input
                      type="text"
                      placeholder="Ask AI anything..."
                      className="flex-1 px-3 py-2 text-sm rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-foreground/20"
                      disabled
                    />
                    <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI Features */}
            <div className="space-y-6 order-1 lg:order-2">
              <h2 className="text-4xl font-bold">
                AI-Powered Assistance
              </h2>
              <p className="text-lg text-muted-foreground">
                Get instant help with writing, summarizing, brainstorming, and more right in your documents.
              </p>
              <ul className="space-y-3">
                {[
                  'Smart suggestions while you write',
                  'Document summarization and analysis',
                  'Brainstorming and ideation support',
                  'Translation and language improvements',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Explore AI Features
              </Button>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            variants={itemVariants}
            className="relative rounded-2xl border border-border bg-secondary p-12 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/5 via-transparent to-foreground/5 pointer-events-none" />

            <div className="relative space-y-6">
              <h3 className="text-3xl sm:text-4xl font-bold">
                Ready to collaborate smarter?
              </h3>
              <p className="mx-auto max-w-xl text-lg text-muted-foreground">
                Join thousands of teams already using Collab to build together
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a href="/dashboard">
                  <Button className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 text-base">
                    Start Free Trial
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}


