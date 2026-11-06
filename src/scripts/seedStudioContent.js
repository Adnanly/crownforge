/**
 * One-time, additive import of the CrownForge content that currently lives in src/config
 * (games, team, website text) into Payload, so it can be edited from /admin.
 *
 *   npx tsx src/scripts/seedStudioContent.js --dry   # show what would happen, write nothing
 *   npx tsx src/scripts/seedStudioContent.js         # create whatever is missing
 *
 * Safe to re-run: existing games (matched by slug), team members (matched by name) and an already
 * saved Website Settings are never touched. Only values already present in the config files are
 * copied; nothing is invented.
 */
import { crownforgeConfig } from "../config/crownforge.config.ts";
import { games } from "../config/games.config.ts";
import { teamMembers } from "../config/team.config.ts";
import { getPayloadClient } from "../lib/payload/client.js";

const DRY = process.argv.includes("--dry");
const context = { trustedImport: true, disableRevalidate: true };

const STATUS_VALUES = {
  "in development": "in-development",
  "coming soon": "coming-soon",
  released: "released",
  "on hold": "on-hold",
};

const clean = (value) => (typeof value === "string" ? value.trim() : "");
const log = (action, what) => console.log(`${DRY ? "[dry] " : ""}${action.padEnd(7)} ${what}`);

const payload = await getPayloadClient();

/* ---------------------------------------------------------------- games */
let featuredCounter = 0;
for (const [index, game] of games.entries()) {
  const existing = await payload.find({
    collection: "studio-games",
    where: { slug: { equals: game.slug } },
    limit: 1,
    depth: 0,
    draft: true,
    overrideAccess: true,
  });
  if (existing.docs.length) {
    log("skip", `game "${game.title}" already exists`);
    continue;
  }

  const statusLabel = clean(game.status);
  const status = statusLabel ? STATUS_VALUES[statusLabel.toLowerCase()] : undefined;
  if (statusLabel && !status) {
    console.warn(`  ! status "${statusLabel}" for ${game.title} has no matching option; leaving it empty`);
  }
  if (game.featured) featuredCounter += 1;

  const data = {
    title: game.title,
    slug: game.slug,
    generateSlug: false,
    ...(status ? { developmentStatus: status } : {}),
    ...(clean(game.shortDescription) ? { shortDescription: clean(game.shortDescription) } : {}),
    ...(clean(game.description) ? { description: clean(game.description) } : {}),
    ...(clean(game.trailer?.videoId) ? { trailerUrl: clean(game.trailer.videoId) } : {}),
    ...(clean(game.genre) ? { genre: clean(game.genre) } : {}),
    ...(game.platforms?.length ? { platforms: game.platforms } : {}),
    ...(clean(game.release) ? { releaseInfo: clean(game.release) } : {}),
    developer: clean(game.developer) || "CrownForge Studio",
    featured: Boolean(game.featured),
    featuredOrder: game.featured ? featuredCounter : 0,
    displayOrder: index + 1,
    _status: "published",
  };

  log("create", `game "${game.title}" (${status || "no status"}${game.featured ? ", featured" : ""})`);
  if (!DRY) {
    await payload.create({ collection: "studio-games", data, context, overrideAccess: true, draft: false });
  }
}

/* ----------------------------------------------------------------- team */
for (const [index, member] of teamMembers.entries()) {
  const existing = await payload.find({
    collection: "team-members",
    where: { name: { equals: member.name } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  if (existing.docs.length) {
    log("skip", `team member "${member.name}" already exists`);
    continue;
  }

  log("create", `team member "${member.name}" - ${member.role}`);
  if (!DRY) {
    await payload.create({
      collection: "team-members",
      data: { name: member.name, role: member.role, displayOrder: index + 1, visible: true },
      context,
      overrideAccess: true,
    });
  }
}

/* ----------------------------------------------------- website settings */
const settings = await payload.findGlobal({ slug: "website-settings", depth: 0, overrideAccess: true });
if (settings?.updatedAt) {
  log("skip", "Website Settings were already saved");
} else {
  const c = crownforgeConfig;
  log("create", "Website Settings (studio name, tagline, homepage text, contact, default SEO)");
  if (!DRY) {
    await payload.updateGlobal({
      slug: "website-settings",
      context,
      overrideAccess: true,
      data: {
        branding: { studioName: c.studioName },
        general: { tagline: c.tagline, description: c.description, contactEmail: c.contactEmail },
        homepage: {
          heroTitle: c.hero.titleLines.join("\n"),
          heroDescription: c.hero.body,
          primaryCtaLabel: c.hero.primaryCtaLabel,
          primaryCtaLink: c.hero.primaryCtaHref,
          secondaryCtaLabel: c.hero.secondaryCtaLabel,
          secondaryCtaLink: c.hero.secondaryCtaHref,
          introEyebrow: c.studioIntro.eyebrow,
          introTitle: c.studioIntro.title,
          introBody: c.studioIntro.body,
        },
        contact: { categories: c.contactPage.categories.map((label) => ({ label })) },
        seo: { title: c.seo.title, description: c.seo.description },
      },
    });
  }
}

console.log(DRY ? "\nDry run finished. Nothing was written." : "\nSeed finished.");
process.exit(0);