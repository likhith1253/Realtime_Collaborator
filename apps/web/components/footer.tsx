'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Separator } from '@/components/ui/separator'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Product: [
      { label: 'Features', href: '/#features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Security', href: '/#features', disabled: true },
      { label: 'Enterprise', href: '/#features', disabled: true },
    ],
    Resources: [
      { label: 'Documentation', href: '#', disabled: true },
      { label: 'API Reference', href: '#', disabled: true },
      { label: 'Blog', href: '#', disabled: true },
      { label: 'Community', href: '#', disabled: true },
    ],
    Company: [
      { label: 'About', href: '#', disabled: true },
      { label: 'Careers', href: '#', disabled: true },
      { label: 'Contact', href: '#', disabled: true },
      { label: 'Status', href: '#', disabled: true },
    ],
    Legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Cookies', href: '#', disabled: true },
      { label: 'Compliance', href: '#', disabled: true },
    ],
  }

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub', disabled: true },
    { icon: Twitter, href: '#', label: 'Twitter', disabled: true },
    { icon: Linkedin, href: '#', label: 'LinkedIn', disabled: true },
    { icon: Mail, href: '#', label: 'Email', disabled: true },
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
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12"
        >
          {/* Top Section */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Logo Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 font-bold text-xl mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                  C
                </div>
                <span>Collab</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Real-time collaborative platform for teams that move fast.
              </p>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-semibold text-sm mb-4">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      {link.disabled ? (
                        <span
                          className="text-sm text-muted-foreground/50 cursor-not-allowed inline-flex items-center"
                          title="Coming soon"
                        >
                          {link.label}
                        </span>
                      ) : (
                        <Link href={link.href}>
                          <motion.span
                            whileHover={{ x: 4 }}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center cursor-pointer"
                          >
                            {link.label}
                          </motion.span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>

          {/* Separator */}
          <Separator />

          {/* Bottom Section */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            {/* Copyright */}
            <div className="text-sm text-muted-foreground text-center sm:text-left">
              © {currentYear} Collab. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map(({ icon: Icon, label, disabled }) => (
                <span
                  key={label}
                  className="p-2 rounded-lg text-muted-foreground/50 cursor-not-allowed"
                  title={disabled ? 'Coming soon' : label}
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </span>
              ))}
            </div>

            {/* Theme Toggle */}
            <div className="text-sm text-muted-foreground">
              Built with modern web technologies
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}
