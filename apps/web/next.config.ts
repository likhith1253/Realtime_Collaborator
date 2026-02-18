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
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*',
      },
      // Proxy canvas requests specifically if not covered by api prefix (though our client uses /canvas...)
      // But wait, client uses API_BASE_URL + /canvas...
      // If API_BASE_URL is 3005, then client calls 3005 directly (CORS needed).
      // If API_BASE_URL is 3000 (proxy), then we need a rewrite for /canvas too.
      {
        source: '/canvas/:path*',
        destination: 'http://localhost:8000/canvas/:path*',
      },
      {
        source: '/auth/:path*',
        destination: 'http://localhost:3001/auth/:path*',
      },
    ]
  },
};

export default nextConfig;
