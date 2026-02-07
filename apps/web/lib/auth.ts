/**
 * Frontend auth utility for interacting with the auth service.
 * Handles current user retrieval via Bearer token authentication.
 */

/**
 * User object returned from /auth/me endpoint.
 * Contains safe, non-sensitive user fields.
 */
export interface User {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
}

/**
 * Get the stored auth token from sessionStorage.
 * Returns null if not in browser or no token stored.
 */
export function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('auth_token');
}

/**
 * Fetches the currently authenticated user from the auth service.
 * 
 * This function:
 * - Calls GET /auth/me on the auth service
 * - Sends token via Authorization header
 * - Returns the user object if authenticated
 * - Returns null if not authenticated or on any error
 * - Never throws - all errors are caught and return null
 * 
 * @returns The authenticated user or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
    try {
        const token = getAuthToken();
        if (!token) {
            return null;
        }

        // Make request to auth service /auth/me endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        // If not 2xx, user is not authenticated
        if (!response.ok) {
            return null;
        }

        // Parse and map user data (backend uses full_name)
        const data = await response.json();
        return {
            id: data.id,
            email: data.email,
            name: data.full_name || data.name || '',
        };
    } catch {
        // Network errors, JSON parse errors, etc.
        // Always return null - never throw
        return null;
    }
}

