'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { FileText, Users, History, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function DocsSection() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    }

    const features = [
        {
            icon: FileText,
            title: 'Rich Documents',
            description: 'Create beautiful documents with rich text formatting, embedded media, and code blocks.',
        },
        {
            icon: Users,
            title: 'Team Collaboration',
            description: 'Work together in real-time with live cursors, comments, and presence indicators.',
        },
        {
            icon: History,
            title: 'Version History',
            description: 'Track every change with detailed version history. Restore any previous version instantly.',
        },
        {
            icon: Zap,
            title: 'Instant Sync',
            description: 'Changes sync across all devices in milliseconds. Never worry about saving again.',
        },
    ]

    return (
        <section id="docs" className="py-20 sm:py-32 lg:py-40 border-t border-border bg-secondary/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="space-y-12"
                >
                    {/* Section Header */}
                    <motion.div variants={itemVariants} className="text-center space-y-4">
                        <h2 className="text-4xl sm:text-5xl font-bold">
                            Documentation & Features
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                            Everything you need to know about creating, editing, and collaborating on documents.
                        </p>
                    </motion.div>

                    {/* Feature Cards */}
                    <motion.div
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {features.map((feature, index) => {
                            const Icon = feature.icon
                            return (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                    className="group p-6 rounded-xl border border-border bg-card hover:bg-secondary hover:border-foreground/20 transition-all duration-300"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-lg bg-secondary group-hover:bg-foreground/10 transition-colors">
                                            <Icon className="w-6 h-6 text-foreground" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-semibold">{feature.title}</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>

                    {/* CTA */}
                    <motion.div variants={itemVariants} className="flex justify-center pt-4">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link href="/auth/sign-up">
                                <Button className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold">
                                    Get Started Free
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
