// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add a rule to handle the undici module
    config.module.rules.push({
      test: /node_modules\/undici\/.*\.js$/,
      type: 'javascript/auto',
    });

    return config;
  },
  // Add transpilePackages if needed
  transpilePackages: ['undici'],
  experimental: {
    serverActions: true,
  }
}

// Use ES Module export instead of CommonJS
export default nextConfig;