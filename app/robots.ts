import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/*?topic=*", "/*?plan=*", "/*?section=*"],
    },
    sitemap: "https://www.alvencoltd.co.uk/sitemap.xml",
    host: "https://www.alvencoltd.co.uk",
  };
}
