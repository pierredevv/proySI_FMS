/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  /**
   * El navegador llama a /api/* en el mismo host que Next; aquí se reenvía al Express.
   * Por defecto coincide con backend/src/server.js (PORT || 3000).
   * Si tu API corre en otro puerto/host (p. ej. Docker), define en .env.local:
   * BACKEND_INTERNAL_URL=http://127.0.0.1:PUERTO
   * Evita usar el mismo puerto que `next dev` (si Next va en 3000, arranca el API en otro o usa next dev -p 3001).
   */
  async rewrites() {
    const backend =
      process.env.BACKEND_INTERNAL_URL?.replace(/\/$/, "") ||
      "http://127.0.0.1:3000"
    return [{ source: "/api/:path*", destination: `${backend}/api/:path*` }]
  },
}

export default nextConfig
