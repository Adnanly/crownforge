import { revalidatePath } from "next/cache";

import { validateYouTubeUrl } from "../lib/youtube.js";

export const GAME_STATUS_OPTIONS = [
  { label: "In Development", value: "in-development" },
  { label: "Coming Soon", value: "coming-soon" },
  { label: "Released", value: "released" },
  { label: "On Hold", value: "on-hold" },
];

export const DEVELOPMENT_STATUS_OPTIONS = [
  { label: "Concept", value: "concept" },
  { label: "In development", value: "in-development" },
  { label: "Completed", value: "completed" },
  { label: "On hold", value: "on-hold" },
];

export const CHARACTER_CATEGORY_OPTIONS = [
  { label: "Playable", value: "playable" },
  { label: "Supporting", value: "supporting" },
  { label: "Antagonist", value: "antagonist" },
  { label: "NPC", value: "npc" },
  { label: "Other", value: "other" },
];

export const OBJECT_CATEGORY_OPTIONS = [
  { label: "Prop", value: "prop" },
  { label: "Weapon", value: "weapon" },
  { label: "Vehicle", value: "vehicle" },
  { label: "Environment", value: "environment" },
  { label: "Building", value: "building" },
  { label: "Equipment", value: "equipment" },
  { label: "Interactive object", value: "interactive" },
  { label: "Other", value: "other" },
];

export const DEVELOPMENT_CATEGORY_OPTIONS = [
  { label: "Gameplay", value: "gameplay" },
  { label: "Characters", value: "characters" },
  { label: "Environment", value: "environment" },
  { label: "3D modeling", value: "modeling" },
  { label: "Animation", value: "animation" },
  { label: "Systems", value: "systems" },
  { label: "Behind the scenes", value: "behind-the-scenes" },
  { label: "Other", value: "other" },
];

export function optionLabel(options, value) {
  return options.find((option) => option.value === value)?.label || "";
}

export const orderField = (name, label, description) => ({
  name,
  label,
  type: "number",
  defaultValue: 0,
  admin: { description: description || "Lower numbers appear first." },
});

export const featuredField = (description) => ({
  name: "featured",
  label: "Featured",
  type: "checkbox",
  defaultValue: false,
  admin: { description },
});

export const uploadField = (name, label, description) => ({
  name,
  label,
  type: "upload",
  relationTo: "media-assets",
  admin: { description: description || "Pick an existing image or upload a new one." },
});

export const galleryField = (description) => ({
  name: "gallery",
  label: "Gallery",
  type: "array",
  labels: { singular: "Image", plural: "Images" },
  admin: {
    initCollapsed: true,
    description: description || "Optional. Add as many images as you like; leave empty to hide the gallery.",
  },
  fields: [
    {
      name: "image",
      label: "Image",
      type: "upload",
      relationTo: "media-assets",
      required: true,
    },
  ],
});

export const youtubeField = (name, label) => ({
  name,
  label,
  type: "text",
  validate: validateYouTubeUrl,
  admin: {
    description: "Paste a YouTube link. Leave empty to hide the video. Videos are never uploaded to the site.",
    placeholder: "https://www.youtube.com/watch?v=...",
  },
});

/** Shared "SEO" tab. Group is named "meta" to match the existing News / Development collections. */
export function seoTab() {
  return {
    label: "SEO",
    description: "Optional. Leave blank to use the page title and description automatically.",
    fields: [
      {
        name: "meta",
        label: "Search & social sharing",
        type: "group",
        fields: [
          { name: "title", label: "SEO title", type: "text" },
          { name: "description", label: "SEO description", type: "textarea" },
          uploadField("image", "Social sharing image (Open Graph)", "Shown when the page is shared. Falls back to the main image."),
        ],
      },
    ],
  };
}

/**
 * Revalidates public pages after content changes. Safe to call outside Next (seed scripts):
 * pass context.disableRevalidate = true or the call is simply ignored on failure.
 */
export function revalidationHooks({ listPath, detailBase, extraPaths = [] }) {
  const run = (docs, context) => {
    if (context?.disableRevalidate) return;
    try {
      revalidatePath("/");
      revalidatePath("/sitemap.xml");
      if (listPath) revalidatePath(listPath);
      for (const path of extraPaths) revalidatePath(path);
      for (const doc of docs) {
        if (doc?.slug && detailBase) revalidatePath(`${detailBase}/${doc.slug}`);
      }
    } catch {
      // Not running inside Next.js (for example a seed script). Nothing to revalidate.
    }
  };

  return {
    afterChange: [({ context, doc, previousDoc }) => run([doc, previousDoc], context)],
    afterDelete: [({ context, doc }) => run([doc], context)],
  };
}