'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { getInvite, InviteInfo } from '@/lib/api-hooks'

function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const inviteToken = searchParams.get('inviteToken')
  const { register, loading: authLoading } = useAuth()

  const [fullName, setFullName] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null)
  const [verifyingInvite, setVerifyingInvite] = useState(false)

  // Verify invite token if present
  useEffect(() => {
    async function verifyToken() {
      if (inviteToken) {
        setVerifyingInvite(true)
        try {
          const info = await getInvite(inviteToken)
          if (info) {
            setInviteInfo(info)
            setEmail(info.email)
            // Auto-generate org name based on user name later, 
            // or maybe just hide org input if joining a project?
            // Actually, even if joining a project, the user still creates their own "Personal" organization technically?
            // Or do they just join the existing one?
            // The AuthService logic creates a new Organization for the user REGARDLESS of invite.
            // The invite just adds them to a Project in ANOTHER organization.
            // So they still need an organization name for their personal workspace.
          }
        } catch (err) {
          console.error("Invalid invite token", err)
          setError("Invalid or expired invite token")
        } finally {
          setVerifyingInvite(false)
        }
      }
    }
    verifyToken()
  }, [inviteToken])

  const passwordStrength = {
    hasLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
  }

  const isPasswordStrong =
    passwordStrength.hasLength &&
    passwordStrength.hasUppercase &&
    passwordStrength.hasNumber

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!fullName || !organizationName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!isPasswordStrong) {
      setError(
        'Password must be at least 8 characters with uppercase and number'
      )
      return
    }

    setLoading(true)
    try {
      await register(email, password, fullName, organizationName, inviteToken || undefined)
      // Redirect to dashboard on success
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const isLoading = loading || authLoading || verifyingInvite

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
          <CardTitle className="text-3xl font-bold text-center">
            {inviteInfo ? 'Join the Team' : 'Create Account'}
          </CardTitle>
          <CardDescription className="text-center text-base">
            {inviteInfo
              ? `You've been invited to join ${inviteInfo.project.name}`
              : 'Join thousands of teams collaborating on Collab'
            }
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Invite Info Banner */}
            {inviteInfo && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center gap-3 text-sm text-primary mb-4">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Invitation Accepted</p>
                  <p className="opacity-90">Creating account for {inviteInfo.email}</p>
                </div>
              </div>
            )}

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

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
                className="h-11 bg-secondary border-border/50 text-base"
              />
            </div>

            {/* Organization */}
            <div className="space-y-2">
              <Label htmlFor="organizationName" className="text-sm font-medium">
                Organization Name
              </Label>
              <Input
                id="organizationName"
                type="text"
                placeholder="Acme Inc"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                disabled={isLoading}
                className="h-11 bg-secondary border-border/50 text-base"
              />
            </div>

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
                disabled={isLoading || !!inviteInfo} // Disable if invited
                className="h-11 bg-secondary border-border/50 text-base"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-11 bg-secondary border-border/50 text-base"
              />
              {/* Password Strength Indicator */}
              <div className="space-y-2 mt-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors ${passwordStrength.hasLength
                      ? 'bg-green-500'
                      : 'bg-muted'
                      }`}
                  />
                  <span className="text-xs text-muted-foreground">
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors ${passwordStrength.hasUppercase
                      ? 'bg-green-500'
                      : 'bg-muted'
                      }`}
                  />
                  <span className="text-xs text-muted-foreground">
                    One uppercase letter
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors ${passwordStrength.hasNumber
                      ? 'bg-green-500'
                      : 'bg-muted'
                      }`}
                  />
                  <span className="text-xs text-muted-foreground">
                    One number
                  </span>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? 'Creating Account...' : 'Create Account'}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Sign In Link */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-border/50 text-foreground hover:bg-secondary text-base font-semibold bg-transparent"
              asChild
            >
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          </form>

          {/* Footer Text */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            By creating an account, you agree to our{' '}
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

export default function SignUpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpForm />
    </Suspense>
  )
}
