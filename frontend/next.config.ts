import type { NextConfig } from "next";
import path from "path";
import dotenv from "dotenv";

// Load .env from root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_AUTH0_DOMAIN: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
    NEXT_PUBLIC_AUTH0_CLIENT_ID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
    NEXT_PUBLIC_LOGIN_ROUTE: process.env.NEXT_PUBLIC_LOGIN_ROUTE,
    NEXT_PUBLIC_CALLBACK_ROUTE: process.env.NEXT_PUBLIC_CALLBACK_ROUTE,
    NEXT_PUBLIC_ACCESS_TOKEN_ROUTE: process.env.NEXT_PUBLIC_ACCESS_TOKEN_ROUTE,
    NEXT_PUBLIC_PROFILE_ROUTE: process.env.NEXT_PUBLIC_PROFILE_ROUTE,
    NEXT_PUBLIC_AI_ENABLED: process.env.NEXT_PUBLIC_AI_ENABLED,
  }
};

export default nextConfig;
