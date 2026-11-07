import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { getSiteSettings } from "@/lib/cms/studio.js";
import {
  createOrganizationJsonLd,
  createPageMetadata,
  getSiteUrl,
  serializeJsonLd,
} from "@/lib/site.js";
import "@/config/validate.config";
import "../globals.css";

// Fonts are bundled in src/assets/fonts (see README there), so builds never fetch from Google.
// Each file is a variable font; the weight range below is what the file actually provides.

// Display / heading font: a soft, modern geometric sans.
const display = localFont({
  src: "../../assets/fonts/PlusJakartaSans-Variable-latin.woff2",
  weight: "500 700",
  style: "normal",
  display: "swap",
  variable: "--font-display",
});

const inter = localFont({
  src: "../../assets/fonts/Inter-Variable-latin.woff2",
  weight: "400 700",
  style: "normal",
  display: "swap",
  variable: "--font-inter",
});

const mono = localFont({
  src: "../../assets/fonts/JetBrainsMono-Variable-latin.woff2",
  weight: "400 500",
  style: "normal",
  display: "swap",
  variable: "--font-mono",
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});

export async function generateMetadata() {
  const settings = await getSiteSettings();

  return {
    ...createPageMetadata({ settings }),
    metadataBase: getSiteUrl(),
    title: {
      default: settings.studioName,
      template: `%s | ${settings.studioName}`,
    },
    ...(settings.faviconUrl ? { icons: { icon: settings.faviconUrl } } : {}),
  };
}

export default async function PublicRootLayout({ children }) {
  const settings = await getSiteSettings();
  const organizationJsonLd = serializeJsonLd(createOrganizationJsonLd(undefined, settings));

  return (
    <html lang="en" className={`${display.variable} ${inter.variable} ${mono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationJsonLd }}
        />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
