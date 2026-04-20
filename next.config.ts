import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      { source: "/\\(app\\)/billing", destination: "/billing", permanent: false },
      { source: "/\\(app\\)/dashboard", destination: "/dashboard", permanent: false },
      { source: "/\\(app\\)/expenses", destination: "/expenses", permanent: false },
      { source: "/\\(app\\)/exports", destination: "/exports", permanent: false },
      { source: "/\\(app\\)/income", destination: "/income", permanent: false },
      { source: "/\\(app\\)/onboarding", destination: "/onboarding", permanent: false },
      { source: "/\\(app\\)/receipts", destination: "/receipts", permanent: false },
      { source: "/\\(app\\)/settings", destination: "/settings", permanent: false },
      { source: "/\\(marketing\\)", destination: "/", permanent: false },
      { source: "/\\(marketing\\)/for-creators", destination: "/for-creators", permanent: false },
      { source: "/\\(marketing\\)/for-freelancers", destination: "/for-freelancers", permanent: false },
      { source: "/\\(marketing\\)/for-landlords", destination: "/for-landlords", permanent: false },
      {
        source: "/\\(marketing\\)/quarterly-tax-calculator",
        destination: "/quarterly-tax-calculator",
        permanent: false,
      },
      {
        source: "/\\(marketing\\)/self-employed-tax-calculator",
        destination: "/self-employed-tax-calculator",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
