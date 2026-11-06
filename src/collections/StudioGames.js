import { slugField } from "payload";

import { adminsOnly, contentAccess } from "../lib/payload/access.js";
import {
  GAME_STATUS_OPTIONS,
  featuredField,
  galleryField,
  orderField,
  revalidationHooks,
  seoTab,
  uploadField,
  youtubeField,
} from "./shared.js";

/**
 * CrownForge games. (The older "games" collection is a hidden legacy metrics sync and is not used
 * by the public site.)
 * @type {import("payload").CollectionConfig}
 */
export const StudioGames = {
  slug: "studio-games",
  labels: { singular: "Game", plural: "Games" },
  admin: {
    useAsTitle: "title",
    group: "Games & World",
    description: "Every game shown on the website. Publishing a game creates its page automatically.",
    defaultColumns: ["title", "developmentStatus", "featured", "featuredOrder", "_status"],
    listSearchableFields: ["title", "slug"],
  },
  access: contentAccess,
  versions: { drafts: true },
  hooks: {
    ...adminsOnly,
    ...revalidationHooks({ listPath: "/games", detailBase: "/games" }),
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            { name: "title", label: "Game title", type: "text", required: true },
            slugField({ useAsSlug: "title", required: true }),
            {
              // Not "status": that name collides with the built-in draft/published "_status" column in Postgres.
              name: "developmentStatus",
              label: "Development status",
              type: "select",
              options: GAME_STATUS_OPTIONS,
              admin: {
                isClearable: true,
                description: "Shown as a badge. Leave empty if the status is not decided yet.",
              },
            },
            {
              name: "shortDescription",
              label: "Short description",
              type: "textarea",
              admin: { description: "One or two sentences. Shown on game cards and in search results." },
            },
            {
              name: "description",
              label: "Full description",
              type: "textarea",
              admin: { description: "Shown on the game page. Leave empty to hide the section." },
            },
          ],
        },
        {
          label: "Images",
          fields: [
            uploadField("coverImage", "Cover image", "Square-ish artwork used on game cards."),
            uploadField("heroImage", "Hero / banner image", "Wide artwork shown behind the game page title."),
            uploadField("logo", "Game logo", "Optional. Transparent PNG works best."),
            galleryField("Optional screenshots and artwork. Leave empty to hide the gallery."),
          ],
        },
        {
          label: "Trailer & details",
          fields: [
            youtubeField("trailerUrl", "YouTube trailer"),
            { name: "genre", label: "Genre", type: "text", admin: { description: "Leave empty to hide." } },
            {
              name: "platforms",
              label: "Platforms",
              type: "text",
              hasMany: true,
              admin: { description: "Type a platform and press Enter. Leave empty to hide." },
            },
            {
              name: "releaseInfo",
              label: "Release information",
              type: "text",
              admin: { description: "For example a date or a window. Leave empty to hide." },
            },
            { name: "developer", label: "Developer", type: "text", defaultValue: "CrownForge Studio" },
          ],
        },
        {
          label: "Homepage & order",
          fields: [
            featuredField("Tick to show this game in the Featured Games section on the homepage (up to 3 are shown)."),
            orderField("featuredOrder", "Featured order", "Order inside the homepage section. Lower numbers appear first."),
            orderField("displayOrder", "List order", "Order on the Games page. Lower numbers appear first."),
          ],
        },
        seoTab(),
      ],
    },
  ],
};