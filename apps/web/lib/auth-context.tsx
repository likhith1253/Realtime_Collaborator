'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  organization?: {
    id: string
    name: string
    slug: string
  } | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName: string, organizationName: string, inviteToken?: string) => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper to map backend response to frontend User interface
function mapUserResponse(data: { id: string; email: string; full_name?: string; name?: string; avatar_url?: string; organization?: { id: string; name: string; slug: string } | null }): User {
  return {
    id: data.id,
    email: data.email,
    name: data.full_name || data.name || '',
    avatar_url: data.avatar_url,
    organization: data.organization,
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is already logged in on mount (token in memory)
  useEffect(() => {
    const checkAuth = async () => {
      // Check if we have a stored token (from sessionStorage for tab persistence)
      const storedToken = sessionStorage.getItem('auth_token')
      if (!storedToken) {
        setLoading(false)
        return
      }

      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const response = await fetch(`${apiBase}/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`,
          },
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(mapUserResponse(userData))
          setToken(storedToken)
        } else {
          // Token invalid, clear it
          sessionStorage.removeItem('auth_token')
          sessionStorage.removeItem('refresh_token')
          // Also clear cookies
          document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
          document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
        }
      } catch (err) {
        console.error('[Auth] Check failed:', err)
        sessionStorage.removeItem('auth_token')
        sessionStorage.removeItem('refresh_token')
        // Also clear cookies
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
        document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      console.log('[AuthContext] Attempting login to:', '/auth/login')
      console.log('[AuthContext] Request body:', { email, password: '***' })

      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      console.log('[AuthContext] Response status:', response.status)
      console.log('[AuthContext] Response headers:', response.headers)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        // Handle different error response formats
        let errorMessage = 'Login failed'
        if (errorData.error) {
          if (Array.isArray(errorData.error)) {
            // Handle Zod validation errors
            errorMessage = (errorData.error as unknown[])
              .map((e) => {
                if (typeof e === 'object' && e !== null) {
                  const maybe = e as { message?: unknown; path?: unknown }
                  if (typeof maybe.message === 'string') return maybe.message
                  if (Array.isArray(maybe.path)) {
                    return maybe.path.filter((p) => typeof p === 'string').join('.')
                  }
                }
                return ''
              })
              .filter(Boolean)
              .join(', ')
          } else {
            // Handle simple error messages
            errorMessage = errorData.error
          }
        } else if (errorData.message) {
          errorMessage = errorData.message
        }
        console.log('[AuthContext] Error response:', errorData)
        throw new Error(errorMessage)
      }

      const data = await response.json().catch(() => {
        throw new Error(`Invalid JSON response from server: ${response.status}`)
      })

      console.log('[AuthContext] Login successful, received data:', data)
      console.log('[AuthContext] Setting user:', mapUserResponse(data.user))

      // Store tokens
      setToken(data.token)
      sessionStorage.setItem('auth_token', data.token)
      sessionStorage.setItem('refresh_token', data.refresh_token)
      // Also store in cookies for middleware access
      document.cookie = `auth_token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
      document.cookie = `refresh_token=${data.refresh_token}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days

      // Set user
      setUser(mapUserResponse(data.user))
    } catch (err) {
      console.error('[AuthContext] Login failed:', err)
      console.error('[AuthContext] Error type:', typeof err)
      console.error('[AuthContext] Error message:', err instanceof Error ? err.message : 'No message')
      console.error('[AuthContext] Error stack:', err instanceof Error ? err.stack : 'No stack')
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
      console.log('[AuthContext] Login finished, loading set to false')
    }
  }

  const register = async (email: string, password: string, fullName: string, organizationName: string, inviteToken?: string) => {
    setLoading(true)
    setError(null)
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiBase}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName, organization_name: organizationName, inviteToken }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        // Handle different error response formats
        let errorMessage = 'Registration failed'
        if (errorData.error) {
          if (Array.isArray(errorData.error)) {
            // Handle Zod validation errors
            errorMessage = (errorData.error as unknown[])
              .map((e) => {
                if (typeof e === 'object' && e !== null) {
                  const maybe = e as { message?: unknown; path?: unknown }
                  if (typeof maybe.message === 'string') return maybe.message
                  if (Array.isArray(maybe.path)) {
                    return maybe.path.filter((p) => typeof p === 'string').join('.')
                  }
                }
                return ''
              })
              .filter(Boolean)
              .join(', ')
          } else {
            // Handle simple error messages
            errorMessage = errorData.error
          }
        } else if (errorData.message) {
          errorMessage = errorData.message
        }
        throw new Error(errorMessage)
      }

      const data = await response.json().catch(() => {
        throw new Error(`Invalid JSON response from server: ${response.status}`)
      })

      // Store tokens
      setToken(data.token)
      sessionStorage.setItem('auth_token', data.token)
      sessionStorage.setItem('refresh_token', data.refresh_token)
      // Also store in cookies for middleware access
      document.cookie = `auth_token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
      document.cookie = `refresh_token=${data.refresh_token}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days

      // Set user
      setUser(mapUserResponse(data.user))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('refresh_token')
    // Clear cookies
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    // Redirect to sign-in page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/sign-in'
    }
  }

  // Update local user state (optimistic update)
  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates })
    }
  }

  // Refresh user data from server
  const refreshUser = async () => {
    const storedToken = sessionStorage.getItem('auth_token')
    if (!storedToken) return

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiBase}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(mapUserResponse(userData))
      }
    } catch (err) {
      console.error('[Auth] Refresh user failed:', err)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    error,
    token,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Export token getter for API calls
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem('auth_token')
}

