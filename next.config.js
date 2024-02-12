/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
        protocol: "https",
      },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "gravatar.com" },
      { hostname: "vadzgguznnjfppiwjgrh.supabase.co" },
    ],
  },
};

module.exports = nextConfig;
