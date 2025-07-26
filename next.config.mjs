/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  env: {
    NEXT_PUBLIC_API_URL: "https://campuslink-production.up.railway.app/api",
  },
}

export default nextConfig
