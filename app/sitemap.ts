import type { MetadataRoute } from "next";
import { cafe } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ["", "/menu", "/contact"].map((path) => ({
    url: `${cafe.siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
