/** @type {import('next').NextConfig} */
const baseConfig = {
  experimental: {
    allowedDevOrigins: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'public.blob.vercel-storage.com' },
    ],
  },
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...baseConfig,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    ...baseConfig.images,
    unoptimized: true,
  },
}

export default nextConfig
