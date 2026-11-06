import { DEVELOPMENT_CATEGORY_OPTIONS, optionLabel } from "@/collections/shared.js";
import { getPayloadClient } from "@/lib/payload/client.js";
import { extractYouTubeId } from "@/lib/youtube.js";

const PUBLISHED = {
  _status: {
    equals: "published",
  },
};

function mediaUrl(value) {
  if (!value || typeof value === "string") return "";
  return value.url || "";
}

function mapRelatedGame(value) {
  if (!value || typeof value !== "object" || !value.slug) return null;
  if (value._status && value._status !== "published") return null;
  return { title: value.title, href: `/games/${value.slug}` };
}

export function mapStudioPost(doc, { hrefBase }) {
  if (!doc) return null;

  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt || "",
    content: doc.content || null,
    coverUrl: mediaUrl(doc.cover),
    publishedAt: doc.publishedAt || doc.createdAt || null,
    authorName: doc.authorName || "",
    featured: Boolean(doc.featured),
    gallery: Array.isArray(doc.gallery)
      ? doc.gallery.map((item) => mediaUrl(item?.image)).filter(Boolean)
      : [],
    videoId: extractYouTubeId(doc.videoUrl),
    categoryLabel: optionLabel(DEVELOPMENT_CATEGORY_OPTIONS, doc.category),
    relatedGame: mapRelatedGame(doc.relatedGame),
    href: `${hrefBase}/${doc.slug}`,
    meta: {
      title: doc.meta?.title || "",
      description: doc.meta?.description || "",
      image: mediaUrl(doc.meta?.image) || mediaUrl(doc.cover),
    },
  };
}

async function findPublished(collection, { slug, limit = 12, featured } = {}) {
  try {
    const payload = await getPayloadClient();
    const where = { ...PUBLISHED };
    if (slug) {
      where.slug = { equals: slug };
    }
    if (featured) {
      where.featured = { equals: true };
    }

    const result = await payload.find({
      collection,
      where,
      sort: "-publishedAt",
      limit,
      depth: 1,
      draft: false,
    });

    return result.docs || [];
  } catch (error) {
    console.error(`[cms] ${collection} query failed:`, error?.message || error);
    return [];
  }
}

export async function getPublishedNews({ limit = 12 } = {}) {
  const docs = await findPublished("news", { limit });
  return docs.map((doc) => mapStudioPost(doc, { hrefBase: "/news" }));
}

export async function getNewsBySlug(slug) {
  const docs = await findPublished("news", { slug, limit: 1 });
  return mapStudioPost(docs[0], { hrefBase: "/news" });
}

export async function getPublishedDevelopmentUpdates({ limit = 12 } = {}) {
  const docs = await findPublished("development-updates", { limit });
  return docs.map((doc) => mapStudioPost(doc, { hrefBase: "/development" }));
}

export async function getDevelopmentUpdateBySlug(slug) {
  const docs = await findPublished("development-updates", { slug, limit: 1 });
  return mapStudioPost(docs[0], { hrefBase: "/development" });
}
