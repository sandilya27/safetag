// Metadata and Schema.org helpers. Set NEXT_PUBLIC_SITE_URL in production so canonical
// URLs, the sitemap and Open Graph tags point at the live domain.
import type { Metadata } from "next";
import { contact } from "./content";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.safetag.sa").replace(/\/$/, "");
export const SITE_NAME = "SAFETAG";

/** Per-page metadata with canonical URL and Open Graph defaults. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} · ${SITE_NAME}`, description, url: path, siteName: SITE_NAME, type: "website", locale: "en_SA" },
    twitter: { card: "summary_large_image", title: `${title} · ${SITE_NAME}`, description },
  };
}

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  email: contact.email,
  telephone: contact.phone,
  address: { "@type": "PostalAddress", addressRegion: "Eastern Province", addressCountry: "SA" },
  areaServed: { "@type": "Country", name: "Saudi Arabia" },
};

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: `${SITE_URL}${t.path}` })),
  };
}
