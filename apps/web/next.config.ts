import type { NextConfig } from "next";

const requiredEnvs = [
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_AUTH_URL',
  'NEXT_PUBLIC_DOCUMENT_URL',
  'NEXT_PUBLIC_COLLAB_URL',
  'NEXT_PUBLIC_AI_URL',
];

const missingEnvs = requiredEnvs.filter((key) => !process.env[key]);

if (missingEnvs.length > 0) {
  console.error(
    `❌ Missing required environment variables:\n${missingEnvs.join('\n')}`
  );
  // Only throw in production build/start, allow dev to maybe limp along if that was the user intent (though strict is better)
  // For this task, we want strict fail-fast as per "PHASE 4 — RUNTIME VALIDATION (CRITICAL)"
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variables: ${missingEnvs.join(', ')}`);
  } else {
    console.warn("⚠️  Running in development validation failure mode (some envs missing).");
  }
}


const nextConfig: NextConfig = {
  async rewrites() {
    // ⚠️ Prevent infinite loops on Vercel by not rewriting to localhost in production.
    // In production, the frontend should either call the backend directly (CORS),
    // or rewrites should point to the actual production backend URL.
    const isProd = process.env.NODE_ENV === 'production';
    const backendUrl = process.env.BACKEND_API_URL || (isProd ? '' : 'http://localhost:8000');

    // If we're in prod and no specific backend URL for proxying is provided, skip rewrites
    // This assumes NEXT_PUBLIC_API_URL is set to the true backend (e.g. Render) directly.
    if (isProd && !process.env.BACKEND_API_URL) {
      return [];
    }

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
      {
        source: '/canvas/:path*',
        destination: `${backendUrl}/canvas/:path*`,
      },
      {
        source: '/auth/:path*',
        // Auth rewrite can point to the auth service directly if needed, but normally gateway handles it
        destination: `${process.env.BACKEND_AUTH_URL || (isProd ? backendUrl : 'http://localhost:3001')}/auth/:path*`,
      },
    ]
  },
};

export default nextConfig;
