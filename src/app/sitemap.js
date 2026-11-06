import { SITE_LAST_MODIFIED, getAbsoluteUrl } from "@/lib/site.js";
import { getCharacters, getGames, getObjects } from "@/lib/cms/studio.js";
import {
  getPublishedDevelopmentUpdates,
  getPublishedNews,
} from "@/lib/cms/studioPosts.js";

export const revalidate = 3600;

const staticRoutes = [
  { changeFrequency: "weekly", path: "/", priority: 1 },
  { changeFrequency: "weekly", path: "/games", priority: 0.9 },
  { changeFrequency: "weekly", path: "/news", priority: 0.7 },
  { changeFrequency: "weekly", path: "/development", priority: 0.7 },
  { changeFrequency: "yearly", path: "/contact", priority: 0.5 },
];

export default async function sitemap() {
  const lastModified = new Date(SITE_LAST_MODIFIED);

  // CMS content is optional; helpers return [] when none exists or the DB is unreachable.
  const [games, characters, objects, news, development] = await Promise.all([
    getGames(),
    getCharacters(),
    getObjects(),
    getPublishedNews({ limit: 100 }),
    getPublishedDevelopmentUpdates({ limit: 100 }),
  ]);

  const gameRoutes = games.map((game) => ({
    changeFrequency: "weekly",
    path: `/games/${game.slug}`,
    priority: 0.8,
  }));

  // Characters and Objects pages are only advertised once something is published.
  const worldRoutes = [
    ...(characters.length
      ? [{ changeFrequency: "weekly", path: "/characters", priority: 0.6 }]
      : []),
    ...(objects.length ? [{ changeFrequency: "weekly", path: "/objects", priority: 0.6 }] : []),
    ...characters.map((item) => ({ changeFrequency: "monthly", path: item.href, priority: 0.5 })),
    ...objects.map((item) => ({ changeFrequency: "monthly", path: item.href, priority: 0.5 })),
  ];

  const postRoutes = [...news, ...development].map((post) => ({
    changeFrequency: "monthly",
    lastModified: post.publishedAt ? new Date(post.publishedAt) : lastModified,
    path: post.href,
    priority: 0.6,
  }));

  return [...staticRoutes, ...gameRoutes, ...worldRoutes, ...postRoutes].map(
    ({ path, lastModified: entryModified, ...entry }) => ({
      ...entry,
      lastModified: entryModified || lastModified,
      url: getAbsoluteUrl(path),
    }),
  );
}