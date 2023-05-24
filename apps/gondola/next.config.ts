import path from 'node:path'

import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  transpilePackages: [
    path.resolve(__dirname, '../../packages/standard'),
    path.resolve(__dirname, '../../packages/ui'),
    path.resolve(__dirname, '../../packages/util'),
    path.resolve(__dirname, '../../packages/connect'),
  ],
  experimental: {typedRoutes: true},
  reactStrictMode: true,
  rewrites: async () => ({
    beforeFiles: [
      {source: '/_posthog/:p*', destination: 'https://app.posthog.com/:p*'},
    ],
    afterFiles: [],
    fallback: [],
  }),
  swcMinify: true,
  typescript: {ignoreBuildErrors: true},
  eslint: {ignoreDuringBuilds: true},
  images: {domains: ['img.clerk.com', 'images.clerk.dev']},
}

export default nextConfig
