/** @type {import('next').NextConfig} */

/* Client tracking is its own Vercel project (`client-tracking`, built with
   basePath "/tracking"). These rewrites proxy it under this domain, so the two
   apps deploy independently but share one address and one cookie jar. */
const TRACKING_ORIGIN = 'https://client-tracking-teal.vercel.app'

const nextConfig = {
  async rewrites() {
    return [
      { source: '/tracking', destination: `${TRACKING_ORIGIN}/tracking` },
      { source: '/tracking/:path*', destination: `${TRACKING_ORIGIN}/tracking/:path*` },
    ]
  },
}

module.exports = nextConfig
