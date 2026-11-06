import {
  SITE_DESCRIPTION,
  SITE_NAME,
  getAbsoluteUrl,
} from "@/lib/site.js";

/** `settings` (resolved Website Settings) and `worldLinks` (published Characters/Objects) are optional. */
export function createLlmsText(siteUrl, { settings, worldLinks = [] } = {}) {
  const url = (path) => getAbsoluteUrl(path, siteUrl);
  const name = settings?.studioName || SITE_NAME;
  const description = settings?.seo?.description || SITE_DESCRIPTION;
  const worldLines = worldLinks.map((item) => `- [${item.label}](${url(item.href)}): ${item.summary}`);

  return [
    `# ${name}`,
    "",
    `> ${description}`,
    "",
    "When to use this site:",
    "",
    "- Use it to identify the studio, discover its games, read official news and development updates, or find the right way to get in touch.",
    "- Do not use this site for account actions, purchases, game administration, or private CMS data; no public interface provides those capabilities.",
    "",
    "## Primary resources",
    "",
    `- [Homepage](${url("/")}): Studio overview and featured games.`,
    `- [Games](${url("/games")}): All CrownForge Studio games, each with its own page.`,
    ...worldLines,
    `- [News](${url("/news")}): Official announcements and milestones.`,
    `- [Development Updates](${url("/development")}): Progress from the making of the games.`,
    `- [Contact](${url("/contact")}): General, business, collaboration, and press inquiries.`,
    "",
    "## Optional",
    "",
    `- [XML sitemap](${url("/sitemap.xml")}): Indexable public URLs and last-modified dates.`,
    `- [Robots policy](${url("/robots.txt")}): Crawler directives for the public website.`,
    "",
  ].join("\n");
}