import type { MetadataRoute } from "next";
import { cafe } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${cafe.siteUrl}/sitemap.xml`,
  };
}
