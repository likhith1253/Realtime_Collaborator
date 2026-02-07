'use client'

import React from "react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

    <div className="min-h-screen flex">
      {/* Left Side - Gradient Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent via-accent/80 to-accent/60 relative overflow-hidden items-center justify-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-accent-foreground rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-white/50 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-accent-foreground px-8 max-w-md">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Work Together Better
            </h1>
            <p className="text-lg opacity-90">
              Real-time collaboration, built for modern teams
            </p>
          </div>

          {/* Illustration Placeholder */}
          <div className="mt-12 flex items-center justify-center">
            <div className="relative w-48 h-48">
              {/* Abstract geometric shapes */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-accent-foreground/20 rounded-lg transform rotate-45" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-12 bg-accent-foreground/10 rounded-full" />
              </div>
              <div className="absolute bottom-4 right-4 w-16 h-16 bg-accent-foreground/15 rounded-lg" />
              <div className="absolute top-8 left-8 w-12 h-12 bg-accent-foreground/20 rounded-full" />
            </div>
          </div>

          {/* Features List */}
          <div className="mt-16 space-y-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-accent-foreground rounded-full" />
              <span className="text-sm font-medium">Instant synchronization</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-accent-foreground rounded-full" />
              <span className="text-sm font-medium">Real-time presence</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-accent-foreground rounded-full" />
              <span className="text-sm font-medium">Secure & encrypted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        {children}
      </div>
    </div>
  )
}
