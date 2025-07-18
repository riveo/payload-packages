import NextBundleAnalyzer from '@next/bundle-analyzer';
import { withPayload } from '@payloadcms/next/withPayload';

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '*': [
      './node_modules/@libsql/darwin-*/**/*',
      './node_modules/@libsql/linux-*/**/*',
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withBundleAnalyzer(
  withPayload(nextConfig, { devBundleServerPackages: false }),
);
