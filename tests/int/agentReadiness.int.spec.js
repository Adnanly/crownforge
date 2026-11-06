import { describe, expect, it, vi } from "vitest";

import { GET as getLlmsText } from "../../src/app/llms.txt/route.js";
import robots from "../../src/app/robots.js";
import sitemap from "../../src/app/sitemap.js";
import { createLlmsText } from "../../src/lib/agent/llms.js";
import { publicSiteContractContent } from "../../src/features/publicSite/content/publicSiteContractContent.js";
import { createPublicJsonResponse } from "../../src/lib/publicSite/api.js";
import {
  SITE_NAME,
  createOrganizationJsonLd,
  createPageMetadata,
  getSiteUrl,
  serializeJsonLd,
} from "../../src/lib/site.js";

const siteUrl = "https://www.crownforge.in";

// The CMS layer talks to Payload/PostgreSQL. Mock it so discovery tests are deterministic and offline.
vi.mock("@/lib/cms/studio.js", () => ({
  getGames: async () => [{ slug: "alpha-game" }],
  getCharacters: async () => [{ href: "/characters/hero" }],
  getObjects: async () => [],
  getSiteSettings: async () => null,
  getWorldNavigation: async () => [{ label: "Characters", href: "/characters" }],
}));
vi.mock("@/lib/cms/studioPosts.js", () => ({
  getPublishedNews: async () => [{ href: "/news/hello", publishedAt: "2026-10-01T00:00:00.000Z" }],
  getPublishedDevelopmentUpdates: async () => [],
}));

function createContract() {
  return {
    catalog: {
      games: [{ universeId: 123 }],
      groups: [{ id: 17206753 }],
    },
    metrics: {
      totalPlaying: 42,
      totalVisits: 1000,
      totalMembers: 500,
    },
    meta: {
      cacheAgeMs: 1000,
      generatedAt: "2026-08-22T00:00:00.000Z",
    },
  };
}

describe("machine-readable discovery", () => {
  it("publishes concise llms.txt guidance using retained resources only", async () => {
    const body = createLlmsText(siteUrl);
    expect(body.startsWith(`# ${SITE_NAME}\n\n> `)).toBe(true);
    expect(body).toContain("When to use this site:");
    expect(body).toContain(`${siteUrl}/`);
    expect(body).toContain(`${siteUrl}/games`);
    for (const path of ["/news", "/development", "/contact"]) {
      expect(body).toContain(`${siteUrl}${path}`);
    }
    expect(body).not.toContain(`${siteUrl}/team`);
    expect(body).not.toContain("/api/public/site-data");
    expect(body).not.toMatch(/roblox|glazing/i);
    expect(body).toContain(`${siteUrl}/sitemap.xml`);
    expect(body).not.toContain("openapi.json");
    expect(body).not.toContain("index.md");
    expect(body).not.toContain("games.md");

    const response = await getLlmsText();
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
    const served = await response.text();
    expect(served).toContain("## Primary resources");
    // Characters/Objects are only advertised once something is published.
    expect(served).toContain("/characters");
    expect(served).not.toContain("/objects");
  });

  it("publishes only the real indexable routes", async () => {
    const configuredSiteUrl = getSiteUrl().origin;
    const sitemapEntries = await sitemap();
    expect(sitemapEntries.map(({ url }) => url)).toEqual([
      `${configuredSiteUrl}/`,
      `${configuredSiteUrl}/games`,
      `${configuredSiteUrl}/news`,
      `${configuredSiteUrl}/development`,
      `${configuredSiteUrl}/contact`,
      `${configuredSiteUrl}/games/alpha-game`,
      // /objects is not advertised because no object is published (mock returns none).
      `${configuredSiteUrl}/characters`,
      `${configuredSiteUrl}/characters/hero`,
      `${configuredSiteUrl}/news/hello`,
    ]);
    expect(sitemapEntries.every(({ lastModified }) => lastModified instanceof Date)).toBe(true);

    const robotsDocument = robots();
    expect(robotsDocument.rules.allow).toContain("/api/public/site-data");
    expect(robotsDocument.rules.disallow).toContain("/admin/");
    expect(robotsDocument.rules.disallow).toContain("/api/");
    expect(robotsDocument.sitemap).toBe(`${configuredSiteUrl}/sitemap.xml`);
  });
});

describe("identity and cache metadata", () => {
  it("builds canonical social metadata and accurate Organization JSON-LD", () => {
    const metadata = createPageMetadata({ path: "/games", title: "Games" });
    expect(metadata.alternates.canonical).toBe("/games");
    expect(metadata.openGraph.type).toBe("website");
    expect(metadata.twitter.card).toBe("summary_large_image");

    const organization = createOrganizationJsonLd(siteUrl);
    expect(organization["@type"]).toBe("Organization");
    expect(organization.name).toBe(SITE_NAME);
    expect(organization.url).toBe(`${siteUrl}/`);
    expect(organization.contactPoint.email).toBe("contact@crownforge.in");
    expect(organization.address).toBeUndefined();
    expect(serializeJsonLd({ value: "</script>" })).not.toContain("</script>");
    expect(getSiteUrl("www.crownforge.in").origin).toBe(siteUrl);
  });

  it("honors weak and strong If-None-Match validators", async () => {
    const contract = createContract();
    const first = createPublicJsonResponse(contract, "site-data");
    const etag = first.headers.get("ETag");
    expect(first.status).toBe(200);
    expect(etag).toBeTruthy();

    const conditional = createPublicJsonResponse(
      contract,
      "site-data",
      new Request(`${siteUrl}/api/public/site-data`, {
        headers: { "If-None-Match": `W/${etag}` },
      }),
    );
    expect(conditional.status).toBe(304);
    expect(await conditional.text()).toBe("");
    expect(conditional.headers.get("ETag")).toBe(etag);
  });
});

describe("legacy public contract content", () => {
  it("carries no inherited-platform copy or fabricated statistics", () => {
    const serialized = JSON.stringify(publicSiteContractContent);
    expect(serialized).not.toMatch(/roblox|glazing|gorilla|\bGGG\b/i);
    for (const fabricated of ["72M+", "457K", "150M+", "1.4K+", "38.3 million", "430K"]) {
      expect(serialized).not.toContain(fabricated);
    }
    expect(publicSiteContractContent.nav.items.map(({ label }) => label)).not.toContain("Media");
  });
});
