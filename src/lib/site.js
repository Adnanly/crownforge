import { getConfiguredSocialLinks } from "@/config/social.config";
import { crownforgeConfig } from "@/config/crownforge.config";

export const SITE_NAME = crownforgeConfig.studioName;
export const SITE_DESCRIPTION = crownforgeConfig.seo.description;
export const DEFAULT_SITE_URL = crownforgeConfig.website;
export const SITE_LAST_MODIFIED = "2026-10-02T00:00:00.000Z";

export function getSiteUrl(value = process.env.NEXT_PUBLIC_SITE_URL) {
  try {
    const rawValue = value instanceof URL ? value.toString() : value;
    const candidate = String(rawValue || DEFAULT_SITE_URL).trim();
    const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
    url.pathname = "/";
    url.search = "";
    url.hash = "";
    return url;
  } catch {
    return new URL(DEFAULT_SITE_URL);
  }
}

export function getAbsoluteUrl(path = "/", siteUrl) {
  return new URL(path, getSiteUrl(siteUrl)).toString();
}

/**
 * `settings` is the optional resolved "Website Settings" object from lib/cms/studio.js.
 * Without it the built-in defaults from src/config are used (tests and scripts rely on that).
 */
export function createPageMetadata({
  description,
  path = "/",
  title,
  image,
  settings,
} = {}) {
  const siteName = settings?.studioName || SITE_NAME;
  const pageTitle = title || siteName;
  const pageDescription = description || settings?.seo?.description || SITE_DESCRIPTION;
  const ogImage = image || settings?.seo?.ogImage || crownforgeConfig.seo.ogImage;
  const twitterImage = image || settings?.seo?.twitterImage || ogImage;
  const openGraph = {
    title: pageTitle,
    description: pageDescription,
    locale: "en_US",
    siteName,
    type: "website",
    url: path,
    ...(ogImage ? { images: [{ url: ogImage }] } : {}),
  };

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: path,
    },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      ...(twitterImage ? { images: [twitterImage] } : {}),
    },
  };
}

export function createOrganizationJsonLd(siteUrl, settings) {
  const baseUrl = getSiteUrl(siteUrl);
  const hasSettings = Boolean(settings);
  const email = (hasSettings ? settings.contactEmail : crownforgeConfig.contactEmail)?.trim();
  const sameAs = (hasSettings ? settings.socialLinks : getConfiguredSocialLinks()).map(
    (link) => link.href,
  );
  const logoUrl = settings?.logoUrl || getAbsoluteUrl("/icon.png", baseUrl);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": getAbsoluteUrl("/#organization", baseUrl),
    name: settings?.studioName || SITE_NAME,
    description: settings?.description || SITE_DESCRIPTION,
    url: getAbsoluteUrl("/", baseUrl),
    logo: {
      "@type": "ImageObject",
      url: logoUrl.startsWith("http") ? logoUrl : getAbsoluteUrl(logoUrl, baseUrl),
      ...(settings?.logoUrl ? {} : { width: 256, height: 256 }),
    },
    ...(email
      ? {
          email,
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "business inquiries",
            email,
            areaServed: "Worldwide",
            availableLanguage: ["English"],
          },
        }
      : {}),
    sameAs,
  };
}

export function serializeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}