import { slugField } from "payload";

import { adminsOnly, contentAccess } from "../lib/payload/access.js";
import {
  DEVELOPMENT_STATUS_OPTIONS,
  featuredField,
  galleryField,
  orderField,
  revalidationHooks,
  seoTab,
  uploadField,
} from "./shared.js";

/**
 * Factory for Characters and Objects, which share the same structure.
 * @param {{
 *   slug: string,
 *   labels: { singular: string, plural: string },
 *   basePath: string,
 *   categoryOptions: { label: string, value: string }[],
 *   categoryLabel: string,
 *   description: string,
 * }} options
 * @returns {import("payload").CollectionConfig}
 */
export function createWorldEntryCollection({
  slug,
  labels,
  basePath,
  categoryOptions,
  categoryLabel,
  description,
}) {
  return {
    slug,
    labels,
    admin: {
      useAsTitle: "name",
      group: "Games & World",
      description,
      defaultColumns: ["name", "game", "category", "developmentStatus", "_status"],
      listSearchableFields: ["name", "slug"],
    },
    access: contentAccess,
    versions: { drafts: true },
    hooks: {
      ...adminsOnly,
      ...revalidationHooks({ listPath: basePath, detailBase: basePath, extraPaths: ["/games"] }),
    },
    fields: [
      {
        type: "tabs",
        tabs: [
          {
            label: "Content",
            fields: [
              { name: "name", label: "Name", type: "text", required: true },
              slugField({ useAsSlug: "name", required: true }),
              {
                name: "game",
                label: "Game",
                type: "relationship",
                relationTo: "studio-games",
                admin: { description: "Optional. Which game this belongs to." },
              },
              {
                name: "category",
                label: categoryLabel,
                type: "select",
                options: categoryOptions,
                admin: { isClearable: true },
              },
              {
                name: "developmentStatus",
                label: "Development status",
                type: "select",
                options: DEVELOPMENT_STATUS_OPTIONS,
                admin: { isClearable: true, description: "Leave empty to hide." },
              },
              { name: "shortDescription", label: "Short description", type: "textarea" },
              {
                name: "description",
                label: "Full description",
                type: "textarea",
                admin: { description: "Shown on the detail page. Leave empty to hide." },
              },
            ],
          },
          {
            label: "Images",
            fields: [
              uploadField("image", "Main image", "Shown on cards and at the top of the detail page."),
              galleryField(),
            ],
          },
          {
            label: "Listing & order",
            fields: [
              featuredField("Mark as a highlight. Featured items are listed first."),
              orderField("displayOrder", "Display order", "Lower numbers appear first."),
            ],
          },
          seoTab(),
        ],
      },
    ],
  };
}