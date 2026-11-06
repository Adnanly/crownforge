import { cache } from "react";

import {
  CHARACTER_CATEGORY_OPTIONS,
  DEVELOPMENT_STATUS_OPTIONS,
  GAME_STATUS_OPTIONS,
  OBJECT_CATEGORY_OPTIONS,
  optionLabel,
} from "@/collections/shared.js";
import { FEATURED_GAMES_LIMIT, crownforgeConfig } from "@/config/crownforge.config";
import { games as configGames } from "@/config/games.config";
import { socialLinks as configSocial } from "@/config/social.config";
import { getPayloadClient } from "@/lib/payload/client.js";
import { extractYouTubeId } from "@/lib/youtube.js";

/**
 * CMS data layer for CrownForge Studio.
 *
 * Payload is the single source of truth for games, team, characters, objects and website settings.
 * src/config is only a safety net: it is used when a collection has never been filled (no documents
 * at all) or the database cannot be reached. Once one document exists, config values are ignored.
 *
 * Local API calls bypass access control, so every public query filters on published/visible itself.
 */

const PUBLISHED = { _status: { equals: "published" } };

function logFailure(scope, error) {
  console.error(`[cms] ${scope} failed:`, error?.message || error);
}

export function mediaUrl(value) {
  if (!value || typeof value !== "object") return "";
  return typeof value.url === "string" ? value.url : "";
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function galleryUrls(gallery) {
  if (!Array.isArray(gallery)) return [];
  return gallery.map((item) => mediaUrl(item?.image)).filter(Boolean);
}

function relatedGame(value) {
  if (!value || typeof value !== "object" || !value.slug) return null;
  if (value._status && value._status !== "published") return null;
  return { id: value.id, title: value.title, slug: value.slug, href: `/games/${value.slug}` };
}

/* ------------------------------------------------------------------ games */

export function mapGame(doc) {
  return {
    id: doc.id,
    slug: doc.slug,
    title: doc.title,
    status: optionLabel(GAME_STATUS_OPTIONS, doc.developmentStatus),
    featured: Boolean(doc.featured),
    featuredOrder: Number(doc.featuredOrder) || 0,
    displayOrder: Number(doc.displayOrder) || 0,
    shortDescription: text(doc.shortDescription),
    description: text(doc.description),
    coverImage: mediaUrl(doc.coverImage),
    heroImage: mediaUrl(doc.heroImage),
    logo: mediaUrl(doc.logo),
    ogImage: mediaUrl(doc.meta?.image),
    trailer: { provider: "youtube", videoId: extractYouTubeId(doc.trailerUrl) },
    gallery: galleryUrls(doc.gallery),
    genre: text(doc.genre),
    platforms: Array.isArray(doc.platforms) ? doc.platforms.filter(Boolean) : [],
    release: text(doc.releaseInfo),
    developer: text(doc.developer),
    meta: { title: text(doc.meta?.title), description: text(doc.meta?.description) },
  };
}

function gameFromConfig(game, index) {
  return {
    id: `config-${game.slug}`,
    slug: game.slug,
    title: game.title,
    status: game.status || "",
    featured: Boolean(game.featured),
    featuredOrder: index,
    displayOrder: index,
    shortDescription: text(game.shortDescription),
    description: text(game.description),
    coverImage: "",
    heroImage: text(game.heroImage),
    logo: text(game.logo),
    ogImage: text(game.ogImage),
    trailer: { provider: "youtube", videoId: text(game.trailer?.videoId) },
    gallery: (game.gallery || []).filter((src) => text(src)),
    genre: text(game.genre),
    platforms: (game.platforms || []).filter(Boolean),
    release: text(game.release),
    developer: text(game.developer),
    meta: { title: "", description: "" },
  };
}

/** All published games, in "List order". */
export const getGames = cache(async () => {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "studio-games",
      where: PUBLISHED,
      sort: ["displayOrder", "title"],
      limit: 200,
      depth: 1,
      draft: false,
    });
    if (result.docs.length) return result.docs.map(mapGame);

    // Nothing published. If drafts exist the owner has taken over: show the empty state.
    const anything = await payload.find({ collection: "studio-games", limit: 1, depth: 0, draft: true });
    if (anything.docs.length) return [];
  } catch (error) {
    logFailure("studio-games query", error);
  }
  return configGames.map(gameFromConfig);
});

export async function getGameBySlug(slug) {
  const games = await getGames();
  return games.find((game) => game.slug === slug) || null;
}

export async function getFeaturedGames(limit = FEATURED_GAMES_LIMIT) {
  const games = await getGames();
  return games
    .filter((game) => game.featured)
    .sort((a, b) => a.featuredOrder - b.featuredOrder || a.displayOrder - b.displayOrder)
    .slice(0, limit);
}
/* ------------------------------------------------- characters and objects */

function mapWorldEntry(doc, { basePath, categoryOptions }) {
  const game = relatedGame(doc.game);
  return {
    id: doc.id,
    slug: doc.slug,
    name: doc.name,
    href: `${basePath}/${doc.slug}`,
    shortDescription: text(doc.shortDescription),
    description: text(doc.description),
    imageUrl: mediaUrl(doc.image),
    gallery: galleryUrls(doc.gallery),
    categoryLabel: optionLabel(categoryOptions, doc.category),
    statusLabel: optionLabel(DEVELOPMENT_STATUS_OPTIONS, doc.developmentStatus),
    featured: Boolean(doc.featured),
    game,
    gameId: game ? game.id : null,
    meta: {
      title: text(doc.meta?.title),
      description: text(doc.meta?.description),
      image: mediaUrl(doc.meta?.image) || mediaUrl(doc.image),
    },
  };
}

async function findWorldEntries(collection, options) {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection,
      where: PUBLISHED,
      sort: ["-featured", "displayOrder", "name"],
      limit: 200,
      depth: 1,
      draft: false,
    });
    return result.docs.map((doc) => mapWorldEntry(doc, options));
  } catch (error) {
    logFailure(`${collection} query`, error);
    return [];
  }
}

const CHARACTER_OPTIONS = { basePath: "/characters", categoryOptions: CHARACTER_CATEGORY_OPTIONS };
const OBJECT_OPTIONS = { basePath: "/objects", categoryOptions: OBJECT_CATEGORY_OPTIONS };

export const getCharacters = cache(() => findWorldEntries("characters", CHARACTER_OPTIONS));
export const getObjects = cache(() => findWorldEntries("objects", OBJECT_OPTIONS));

export async function getCharacterBySlug(slug) {
  const items = await getCharacters();
  return items.find((item) => item.slug === slug) || null;
}

export async function getObjectBySlug(slug) {
  const items = await getObjects();
  return items.find((item) => item.slug === slug) || null;
}

export async function getCharactersForGame(gameId) {
  const items = await getCharacters();
  return items.filter((item) => item.gameId && item.gameId === gameId);
}

export async function getObjectsForGame(gameId) {
  const items = await getObjects();
  return items.filter((item) => item.gameId && item.gameId === gameId);
}

/** Footer links for sections that have published content (empty sections are not advertised). */
export async function getWorldNavigation() {
  const [characters, objects] = await Promise.all([getCharacters(), getObjects()]);
  const items = [];
  if (characters.length) items.push({ label: "Characters", href: "/characters" });
  if (objects.length) items.push({ label: "Objects", href: "/objects" });
  return items;
}

/* --------------------------------------------------------------- settings */

const SOCIAL_LABELS = {
  discord: "Discord",
  instagram: "Instagram",
  youtube: "YouTube",
  x: "X",
  github: "GitHub",
  linkedin: "LinkedIn",
  facebook: "Facebook",
};
const SOCIAL_ORDER = ["discord", "instagram", "youtube", "x", "github", "linkedin", "facebook"];

function isHttpUrl(value) {
  return /^https?:\/\//i.test(value);
}

/**
 * Merges the "Website Settings" global over the built-in defaults.
 * - Empty text fields fall back to the defaults in src/config.
 * - Once the settings have been saved at least once, an empty contact email or second hero button
 *   means "hide it" (the admin forms promise this).
 */
export function resolveSettings(raw) {
  const config = crownforgeConfig;
  const saved = Boolean(raw && raw.updatedAt);
  const branding = raw?.branding || {};
  const general = raw?.general || {};
  const homepage = raw?.homepage || {};
  const contact = raw?.contact || {};
  const social = raw?.social || {};
  const seo = raw?.seo || {};

  const studioName = text(branding.studioName) || config.studioName;
  const logoUrl = mediaUrl(branding.logo) || text(config.branding.logo);
  const heroImageUrl = mediaUrl(branding.heroImage) || text(config.branding.heroImage);
  const description = text(general.description) || config.description;

  const titleLines = text(homepage.heroTitle)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const savedSecondaryLabel = saved
    ? text(homepage.secondaryCtaLabel)
    : text(homepage.secondaryCtaLabel) || config.hero.secondaryCtaLabel;
  const savedSecondaryHref = text(homepage.secondaryCtaLink) || config.hero.secondaryCtaHref;
  // The public Team page was removed. An older saved Website Settings record may still hold the
  // 'Meet the Team' button, so it is hidden when rendering (the CMS record itself is left as is).
  const secondaryIsRemovedTeamCta =
    /^\/team\/?([?#].*)?$/i.test(savedSecondaryHref) || /^meet the team$/i.test(savedSecondaryLabel);
  const secondaryLabel = secondaryIsRemovedTeamCta ? "" : savedSecondaryLabel;
  const contactEmail = saved
    ? text(general.contactEmail)
    : text(general.contactEmail) || text(config.contactEmail);

  const categories = Array.isArray(contact.categories)
    ? contact.categories.map((item) => text(item?.label)).filter(Boolean)
    : [];

  const socialLinks = SOCIAL_ORDER.map((id) => {
    const href = text(social[id]) || text(configSocial[id]);
    return href && isHttpUrl(href) ? { id, label: SOCIAL_LABELS[id], href } : null;
  }).filter(Boolean);

  const ogImage = mediaUrl(seo.ogImage) || text(config.seo.ogImage);

  return {
    studioName,
    tagline: text(general.tagline) || config.tagline,
    description,
    contactEmail,
    website: config.website,
    navigation: config.navigation,
    logoUrl,
    footerLogoUrl: mediaUrl(branding.footerLogo) || logoUrl,
    faviconUrl: mediaUrl(branding.favicon),
    heroImageUrl,
    hero: {
      titleLines: titleLines.length ? titleLines : config.hero.titleLines,
      body: text(homepage.heroDescription) || config.hero.body,
      primaryCtaLabel: text(homepage.primaryCtaLabel) || config.hero.primaryCtaLabel,
      primaryCtaHref: text(homepage.primaryCtaLink) || config.hero.primaryCtaHref,
      secondaryCtaLabel: secondaryLabel,
      secondaryCtaHref: secondaryIsRemovedTeamCta ? "" : savedSecondaryHref,
    },
    studioIntro: {
      eyebrow: text(homepage.introEyebrow) || config.studioIntro.eyebrow,
      title: text(homepage.introTitle) || config.studioIntro.title,
      body: text(homepage.introBody) || config.studioIntro.body,
    },
    contactText: text(contact.description) || description,
    contactCategories: categories.length ? categories : config.contactPage.categories,
    socialLinks,
    seo: {
      title: text(seo.title) || config.seo.title,
      description: text(seo.description) || config.seo.description,
      ogImage,
      twitterImage: mediaUrl(seo.twitterImage) || ogImage,
    },
  };
}

export const getSiteSettings = cache(async () => {
  let raw = null;
  try {
    const payload = await getPayloadClient();
    raw = await payload.findGlobal({ slug: "website-settings", depth: 1 });
  } catch (error) {
    logFailure("website-settings query", error);
  }
  return resolveSettings(raw);
});