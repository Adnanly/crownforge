import { adminsOnly, publicRead } from "../lib/payload/access.js";

function slugifyName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Technical fields are filled in automatically so editors only need a title and the file. */
function fillTechnicalFields({ data, operation, req }) {
  if (operation !== "create") return data;

  const next = { ...(data || {}) };
  const file = req?.file;
  const fileName = file?.name || next.filename || "";

  if (!next.title && fileName) {
    next.title = fileName.replace(/\.[^.]+$/, "");
  }
  if (!next.registryKey) {
    next.registryKey = `${slugifyName(fileName) || "media"}-${Date.now().toString(36)}`;
  }
  if (!next.kind) {
    const mime = file?.mimetype || next.mimeType || "";
    next.kind = String(mime).startsWith("video/") ? "video" : "image";
  }

  return next;
}

/** @type {import("payload").CollectionConfig} */
export const MediaAssets = {
  slug: "media-assets",
  labels: { singular: "Media file", plural: "Media" },
  admin: {
    useAsTitle: "title",
    group: "Media",
    description: "Upload images here once, then pick them from any other form.",
    defaultColumns: ["title", "alt", "filename", "createdAt"],
    listSearchableFields: ["title", "filename"],
  },
  access: publicRead,
  upload: {
    mimeTypes: ["image/*", "video/*"],
  },
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
      admin: { description: "A short name so you can find this file later." },
    },
    {
      name: "alt",
      label: "Alt text",
      type: "text",
      admin: { description: "Describe the image for visitors who cannot see it. Recommended for images." },
    },
    {
      name: "registryKey",
      type: "text",
      required: true,
      unique: true,
      admin: { condition: () => false, description: "Generated automatically." },
    },
    {
      name: "kind",
      type: "select",
      required: true,
      options: [
        {
          label: "Image",
          value: "image",
        },
        {
          label: "Video",
          value: "video",
        },
      ],
      admin: { condition: () => false, description: "Detected automatically." },
    },
  ],
  hooks: {
    ...adminsOnly,
    beforeValidate: [fillTechnicalFields],
  },
};
