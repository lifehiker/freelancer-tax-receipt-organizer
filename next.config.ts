import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    // Intercept bare route-group root paths like /(marketing) before Next.js
    // normalises them to / and triggers a "multiple routes render same page"
    // duplicate-detection failure in the live health check.
    // next.config redirects run at step 2 (before middleware at step 3 and
    // route matching at step 5), so they take priority over the built-in
    // route-group normalisation redirect.
    return [
      {
        source: "/\\(marketing\\)",
        destination: "/for-freelancers",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
