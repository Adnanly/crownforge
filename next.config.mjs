/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  reactStrictMode: true,
  // Required: prevents firebase-admin from being bundled on the client/edge
  serverExternalPackages: ["firebase-admin"],
};

export default nextConfig;
