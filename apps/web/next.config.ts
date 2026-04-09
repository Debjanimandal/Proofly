import type { NextConfig } from 'next';
import { config as loadDotenv } from 'dotenv';
import { resolve } from 'node:path';

// Load .env from monorepo root so NEXT_PUBLIC_* vars are available
loadDotenv({ path: resolve(__dirname, '../../.env'), override: false });

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
