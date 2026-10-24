import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans, Lato } from "next/font/google";
import { Suspense } from "react";
import { ChatProvider } from "@/components/chat-context";
import { ChatWidget } from "@/components/chat-widget";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { JsonLd } from "@/components/ui";
import { organizationLd, SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });
const plexSans = IBM_Plex_Sans({ variable: "--font-plex-sans", subsets: ["latin"], weight: ["400", "500", "600"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500", "600"] });
const lato = Lato({ variable: "--font-lato-face", subsets: ["latin"], weight: ["400", "900"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "SAFETAG · Calibration, testing and inspection", template: `%s · ${SITE_NAME}` },
  description:
    "SAFETAG delivers traceable calibration, non-destructive testing and third-party inspection across the Kingdom of Saudi Arabia, in our laboratories or at your site.",
  applicationName: SITE_NAME,
  openGraph: { siteName: SITE_NAME, type: "website", locale: "en_SA" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fafbfa",
};

// Runs before first paint: drop to the static fallback on save-data or low-power devices,
// or when forced with ?motion=static (the prototype's "Motion: static" tweak).
// ?motion=on skips the device check, for testing the story on any hardware.
const motionScript = `(function(){try{var n=navigator,c=n.connection,q=location.search;if(/[?&]motion=on\\b/.test(q))return;if((c&&c.saveData)||(n.hardwareConcurrency<=4&&n.deviceMemory<=4)||/[?&]motion=static\\b/.test(q))document.documentElement.dataset.motion="static"}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable} ${lato.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
      </head>
      <body>
        <a href="#content" className="fixed start-4 top-3 z-60 -translate-y-20 rounded bg-ink px-4 py-2.5 text-sm font-semibold text-white no-underline focus:translate-y-0 focus:text-white">
          Skip to content
        </a>
        <JsonLd data={organizationLd} />
        <ChatProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
          <Suspense fallback={null}>
            <ChatWidget />
          </Suspense>
        </ChatProvider>
      </body>
    </html>
  );
}
