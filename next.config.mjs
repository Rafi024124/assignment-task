/** @type {import('next').NextConfig} */
const nextConfig = {
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "**", // Allow any host
    },
  ],
},
};

export default nextConfig;
