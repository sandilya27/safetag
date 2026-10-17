import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans, Lato } from "next/font/google";
import "./globals.css";

const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });
const plexSans = IBM_Plex_Sans({ variable: "--font-plex-sans", subsets: ["latin"], weight: ["400", "500", "600"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500", "600"] });
const lato = Lato({ variable: "--font-lato-face", subsets: ["latin"], weight: ["400", "900"] });

export const metadata: Metadata = {
  title: "SAFETAG · Calibration, testing and inspection",
  description:
    "SAFETAG delivers traceable calibration, non-destructive testing and third-party inspection across the Kingdom of Saudi Arabia, in our laboratories or at your site.",
};

// Runs before first paint: drop to the static fallback on save-data or low-power devices,
// or when forced with ?motion=static (the prototype's "Motion: static" tweak).
const motionScript = `(function(){try{var n=navigator,c=n.connection;if((c&&c.saveData)||(n.hardwareConcurrency<=4&&n.deviceMemory<=4)||/[?&]motion=static\\b/.test(location.search))document.documentElement.dataset.motion="static"}catch(e){}})()`;

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
      <body>{children}</body>
    </html>
  );
}
