import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
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

// Display / heading font: a soft, modern geometric sans.
const display = Plus_Jakarta_Sans({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
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
