import { slugField } from "payload";

import { adminsOnly, contentAccess } from "../lib/payload/access.js";
import { featuredField, revalidationHooks, seoTab, uploadField } from "./shared.js";

function hasRichText(value) {
  const children = value?.root?.children;
  if (!Array.isArray(children)) return false;
  return /"text":"[^"]+"/.test(JSON.stringify(children));
}

/** The body is only mandatory when publishing; drafts can be saved incomplete. */
function validateBodyOnPublish(value, { data }) {
  if (data?._status === "published" && !hasRichText(value)) {
    return "Write the article body before publishing (or save it as a draft).";
  }
  return true;
}

/**
 * @param {{
 *   slug: string,
 *   labels: { singular: string, plural: string },
 *   basePath: string,
 *   description?: string,
 *   excerptLabel?: string,
 *   extraMediaFields?: object[],
 *   extraDetailFields?: object[],
 * }} options
 * @returns {import("payload").CollectionConfig}
 */
export function createStudioPostCollection({
  slug,
  labels,
  basePath,
  description,
  excerptLabel = "Short summary",
  extraMediaFields = [],
  extraDetailFields = [],
}) {
  return {
    slug,
    labels,
    admin: {
      useAsTitle: "title",
      defaultColumns: ["title", "_status", "publishedAt", "featured"],
      group: "Content",
      description,
      listSearchableFields: ["title", "slug"],
    },
    access: contentAccess,
    versions: {
      drafts: true,
    },
    hooks: {
      ...adminsOnly,
      ...revalidationHooks({ listPath: basePath, detailBase: basePath }),
      beforeChange: [
        ({ data }) => {
          if (data?._status === "published" && !data.publishedAt) {
            return { ...data, publishedAt: new Date().toISOString() };
          }
          return data;
        },
      ],
    },
    fields: [
      {
        type: "tabs",
        tabs: [
          {
            label: "Content",
            fields: [
              { name: "title", label: "Title", type: "text", required: true },
              slugField({ name: "slug", useAsSlug: "title", required: true }),
              {
                name: "excerpt",
                label: excerptLabel,
                type: "textarea",
                admin: { description: "Shown on cards and in search results." },
              },
              {
                name: "content",
                label: "Body",
                type: "richText",
                validate: validateBodyOnPublish,
              },
            ],
          },
          {
            label: "Images & video",
            fields: [
              uploadField("cover", "Featured image", "Shown on cards and at the top of the article."),
              ...extraMediaFields,
            ],
          },
          {
            label: "Publishing",
            fields: [
              {
                name: "publishedAt",
                label: "Publish date",
                type: "date",
                admin: {
                  date: { pickerAppearance: "dayAndTime" },
                  description: "Filled in automatically when you publish. Change it to backdate or reorder.",
                },
              },
              {
                name: "authorName",
                label: "Author",
                type: "text",
                admin: { description: "Optional byline shown on the page." },
              },
              featuredField("Tick to highlight this post."),
              ...extraDetailFields,
            ],
          },
          seoTab(),
        ],
      },
    ],
  };
}
