import { getAuthToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface FetchOptions extends RequestInit {
  timeout?: number
}

let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

function subscribeToRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback)
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach(callback => callback(token))
  refreshSubscribers = []
}

async function refreshToken(): Promise<string | null> {
  const refreshToken = sessionStorage.getItem('refresh_token')
  if (!refreshToken) return null

  try {
    const response = await fetch('/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refreshToken }),
    })

    if (!response.ok) return null

    const data = await response.json().catch(() => {
      // If JSON parsing fails, try to get text for debugging
      throw new Error(`Invalid JSON response from server: ${response.status}`)
    })
    sessionStorage.setItem('auth_token', data.token)
    sessionStorage.setItem('refresh_token', data.refresh_token)

    return data.token
  } catch {
    return null
  }
}

export class ApiClient {
  static async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { timeout = 30000, ...fetchOptions } = options

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const url = `${API_BASE_URL}${endpoint}`
      console.log('[API] Request:', { url, method: fetchOptions.method || 'GET' })

      let token = getAuthToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      };

      if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
        headers,
        credentials: 'include',
      })

      // Handle 401 - try to refresh token
      if (response.status === 401 && token) {
        if (isRefreshing) {
          // Wait for refresh to complete
          const newToken = await new Promise<string>((resolve) => {
            subscribeToRefresh(resolve)
          })
          token = newToken
        } else {
          isRefreshing = true
          const newToken = await refreshToken()
          isRefreshing = false

          if (newToken) {
            onRefreshed(newToken)
            token = newToken

            // Retry the request with new token
            const retryHeaders: HeadersInit = {
              'Content-Type': 'application/json',
              ...fetchOptions.headers,
              'Authorization': `Bearer ${token}`,
            }

            const retryResponse = await fetch(url, {
              ...fetchOptions,
              signal: controller.signal,
              headers: retryHeaders,
              credentials: 'include',
            })

            if (retryResponse.ok) {
              const data = await retryResponse.json()
              console.log('[API] Retry successful:', { url, status: retryResponse.status })
              return data as T
            }
          }
        }

        // If refresh failed or retry still failed, redirect to login
        console.log('[API] Authentication failed - redirecting to login')
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('auth_token')
          sessionStorage.removeItem('refresh_token')
          if (!window.location.pathname.includes('/auth')) {
            window.location.href = '/auth/sign-in'
          }
        }
        throw new Error('Authentication failed')
      }

      const data = await response.json().catch(() => {
        // If JSON parsing fails, try to get text for debugging
        throw new Error(`Invalid JSON response from server: ${response.status}`)
      })

      if (!response.ok) {
        // Only log errors in development, not in production
        if (process.env.NODE_ENV === 'development') {
          console.log('[API] Error Response:', { url, status: response.status, statusText: response.statusText });
        }
        const error = new Error(
          data.message || `API Error: ${response.status} ${response.statusText}`
        )
        throw error
      }

      // Only log successful responses in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[API] Response:', { url, status: response.status })
      }
      return data as T
    } finally {
      clearTimeout(timeoutId)
    }
  }

  static get<T>(endpoint: string, options?: FetchOptions) {
    return this.fetch<T>(endpoint, { ...options, method: 'GET' })
  }

  static post<T>(endpoint: string, body?: unknown, options?: FetchOptions) {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  static put<T>(endpoint: string, body?: unknown, options?: FetchOptions) {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    })
  }

  static delete<T>(endpoint: string, options?: FetchOptions) {
    return this.fetch<T>(endpoint, { ...options, method: 'DELETE' })
  }
}
