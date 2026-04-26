import type { MetadataRoute } from "next";

const BASE_URL = "https://flowdrop-ai.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/auth/login",
    "/auth/onboarding",
    "/home",
    "/drops",
    "/team",
    "/insights",
    "/files",
    "/archive",
    "/settings",
  ];

  const now = new Date();
  return routes.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "daily",
    priority: path === "" ? 1 : 0.7,
  }));
}
