import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // 301 redirect dominio vecchio → nuovo (richiede che alvencoltd.co.uk punti allo stesso deployment Vercel)
      { source: "/:path*", has: [{ type: "host", value: "alvencoltd.co.uk" }], destination: "https://www.qc-tech.co.uk/:path*", permanent: true },
      { source: "/:path*", has: [{ type: "host", value: "www.alvencoltd.co.uk" }], destination: "https://www.qc-tech.co.uk/:path*", permanent: true },
      { source: "/servizi", destination: "/it/servizi", permanent: true },
      { source: "/vision", destination: "/it/vision", permanent: true },
      { source: "/faq", destination: "/it/faq", permanent: true },
      { source: "/blog", destination: "/it/blog", permanent: true },
      { source: "/contatti", destination: "/it/contatti", permanent: true },
      { source: "/en/servizi", destination: "/en/services", permanent: true },
      { source: "/en/vision", destination: "/en/about", permanent: true },
      { source: "/en/contatti", destination: "/en/contacts", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
