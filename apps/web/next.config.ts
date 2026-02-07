import type { NextConfig } from "next";

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
