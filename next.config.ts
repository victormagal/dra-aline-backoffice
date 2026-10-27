import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: '/', destination: '/consultas', permanent: false }];
  },
};

export default nextConfig;
