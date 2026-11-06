import { createStudioPostCollection } from "./studioPosts.js";
import { DEVELOPMENT_CATEGORY_OPTIONS, galleryField, youtubeField } from "./shared.js";

/** @type {import("payload").CollectionConfig} */
export const DevelopmentUpdates = createStudioPostCollection({
  slug: "development-updates",
  labels: { singular: "Development update", plural: "Development Updates" },
  basePath: "/development",
  description: "Progress posts about making the games. Only published updates appear on the website.",
  excerptLabel: "Short summary",
  extraMediaFields: [
    galleryField("Optional extra images. Leave empty to hide the gallery."),
    youtubeField("videoUrl", "YouTube video"),
  ],
  extraDetailFields: [
    {
      name: "relatedGame",
      label: "Related game",
      type: "relationship",
      relationTo: "studio-games",
      admin: { description: "Optional. Links the update to a game." },
    },
    {
      name: "category",
      label: "Development area",
      type: "select",
      options: DEVELOPMENT_CATEGORY_OPTIONS,
      admin: { isClearable: true, description: "Optional. Shown as a label on the post." },
    },
  ],
});
