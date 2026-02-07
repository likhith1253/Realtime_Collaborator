'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'

export default function SignInPage() {
  const router = useRouter()
  const { login, loading: authLoading, isAuthenticated } = useAuth()

  const [email, setEmail] = useState(process.env.NODE_ENV === 'development' ? 'kevin@gmail.com' : '')
  const [password, setPassword] = useState(process.env.NODE_ENV === 'development' ? 'Kevin1234' : '')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loginAttempted, setLoginAttempted] = useState(false)

  // Dev-only auto-login
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !isAuthenticated && !loading && !loginAttempted) {
      // Small delay to ensure hydration
      const timer = setTimeout(() => {
        const autoLogin = async () => {
          setLoading(true)
          try {
            await login('kevin@gmail.com', 'Kevin1234')
            setLoginAttempted(true)
          } catch (e) {
            console.error('Auto-login failed', e)
            setLoading(false)
          }
        }
        autoLogin()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])


  // Navigate to dashboard once authenticated after login attempt
  useEffect(() => {
    if (loginAttempted && isAuthenticated && !authLoading) {
      console.log('[SignIn] Auth confirmed, navigating to dashboard')
      router.replace('/dashboard')
    }
  }, [loginAttempted, isAuthenticated, authLoading, router])

  // Also redirect if already authenticated on mount
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      await login(email, password)
      // Mark that login was attempted so useEffect can handle navigation
      // once React state updates are committed
      setLoginAttempted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      setLoading(false)
    }
  }

  const isLoading = loading || authLoading


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <Card className="border-border/50">
        <CardHeader className="space-y-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/80 rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-lg">C</span>
              </div>
            </div>
          </motion.div>
          <CardTitle className="text-3xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center text-base">
            Welcome back to Collab
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
              >
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </motion.div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-11 bg-secondary border-border/50 text-base"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => alert('Password reset feature coming soon!')}
                  className="text-xs text-muted-foreground/60 cursor-not-allowed font-medium"
                  title="Coming soon"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-11 bg-secondary border-border/50 text-base"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-accent text-accent-foreground hover:bg-accent/90 text-base font-semibold mt-6"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  New to Collab?
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-border/50 text-foreground hover:bg-secondary text-base font-semibold bg-transparent"
              asChild
            >
              <Link href="/auth/sign-up">Create Account</Link>
            </Button>
          </form>

          {/* Footer Text */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-accent hover:text-accent/80">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-accent hover:text-accent/80">
              Privacy Policy
            </Link>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

