import { createStudioPostCollection } from "./studioPosts.js";

/** @type {import("payload").CollectionConfig} */
export const News = createStudioPostCollection({
  slug: "news",
  labels: { singular: "News article", plural: "News" },
  basePath: "/news",
  description: "Official announcements. Only published articles appear on the website.",
  excerptLabel: "Short summary",
});
