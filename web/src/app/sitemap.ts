import type { MetadataRoute } from "next";
import { articleHref, articles } from "@/lib/articles";
import { projectHref, projects, serviceHref, services } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

const PAGES = ["", "/about", "/services", "/industries", "/laboratories", "/certifications", "/projects", "/careers", "/news", "/faq", "/contact", "/request-a-quote", "/privacy-policy", "/terms-and-conditions"];

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (p: string) => `${SITE_URL}${p}`;
  return [
    ...PAGES.map((p) => ({ url: url(p), changeFrequency: "monthly" as const, priority: p === "" ? 1 : p === "/services" || p === "/request-a-quote" ? 0.9 : 0.6 })),
    ...services.map((s) => ({ url: url(serviceHref(s)), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...projects.map((p) => ({ url: url(projectHref(p)), changeFrequency: "yearly" as const, priority: 0.5 })),
    ...articles.map((a) => ({ url: url(articleHref(a)), lastModified: a.date, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
