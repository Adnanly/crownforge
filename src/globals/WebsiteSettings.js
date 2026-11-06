import { revalidatePath } from "next/cache";

import { globalAccess } from "../lib/payload/access.js";
import { uploadField } from "../collections/shared.js";
import { validateOptionalUrl } from "../lib/youtube.js";

const socialField = (name, label) => ({
  name,
  label,
  type: "text",
  validate: validateOptionalUrl,
  admin: { placeholder: "https://", description: "Leave empty to hide this link everywhere." },
});

/** @type {import("payload").GlobalConfig} */
export const WebsiteSettings = {
  slug: "website-settings",
  label: "Website Settings",
  access: globalAccess,
  admin: {
    group: "Studio",
    description:
      "Branding, homepage text, contact details, social links and default SEO for the whole website. Empty fields fall back to the built-in defaults.",
  },
  hooks: {
    afterChange: [
      ({ context }) => {
        if (context?.disableRevalidate) return;
        try {
          revalidatePath("/", "layout");
        } catch {
          // Not running inside Next.js (seed script).
        }
      },
    ],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          name: "branding",
          label: "Branding",
          fields: [
            {
              name: "studioName",
              label: "Studio name",
              type: "text",
              admin: { description: "Shown in the header, footer and page titles." },
            },
            uploadField("logo", "Header logo", "Optional. When empty the studio name is shown instead."),
            uploadField("footerLogo", "Footer logo", "Optional. Falls back to the header logo."),
            uploadField("favicon", "Favicon", "Small square image shown in browser tabs (PNG, at least 64x64)."),
            uploadField("heroImage", "Homepage hero image", "Optional artwork behind the homepage title."),
          ],
        },
        {
          name: "general",
          label: "General",
          fields: [
            { name: "tagline", label: "Tagline", type: "text" },
            {
              name: "description",
              label: "Studio description",
              type: "textarea",
              admin: { description: "A sentence or two about the studio. Used on the Contact page." },
            },
            {
              name: "contactEmail",
              label: "Contact email",
              type: "email",
              admin: { description: "Leave empty to hide the email and the contact form." },
            },
          ],
        },
        {
          name: "homepage",
          label: "Homepage",
          fields: [
            {
              name: "heroTitle",
              label: "Hero title",
              type: "textarea",
              admin: {
                description: "One line per row. With two or more lines, the last one is highlighted in yellow.",
              },
            },
            { name: "heroDescription", label: "Hero description", type: "textarea" },
            { name: "primaryCtaLabel", label: "Main button text", type: "text" },
            { name: "primaryCtaLink", label: "Main button link", type: "text", admin: { placeholder: "/games" } },
            {
              name: "secondaryCtaLabel",
              label: "Second button text",
              type: "text",
              admin: { description: "Leave empty to hide the second button." },
            },
            { name: "secondaryCtaLink", label: "Second button link", type: "text", admin: { placeholder: "/contact" } },
            { name: "introEyebrow", label: "Introduction - small label", type: "text" },
            { name: "introTitle", label: "Introduction - title", type: "text" },
            { name: "introBody", label: "Introduction - text", type: "textarea" },
          ],
        },
        {
          name: "contact",
          label: "Contact",
          fields: [
            {
              name: "description",
              label: "Contact page text",
              type: "textarea",
              admin: { description: "Leave empty to use the studio description." },
            },
            {
              name: "categories",
              label: "Contact form categories",
              type: "array",
              labels: { singular: "Category", plural: "Categories" },
              admin: {
                initCollapsed: true,
                description: "Options in the contact form drop-down. Leave empty for the defaults.",
              },
              fields: [{ name: "label", label: "Category", type: "text", required: true }],
            },
          ],
        },
        {
          name: "social",
          label: "Social links",
          fields: [
            socialField("instagram", "Instagram"),
            socialField("youtube", "YouTube"),
            socialField("discord", "Discord"),
            socialField("x", "X / Twitter"),
            socialField("linkedin", "LinkedIn"),
            socialField("facebook", "Facebook"),
            socialField("github", "GitHub"),
          ],
        },
        {
          name: "seo",
          label: "Default SEO",
          fields: [
            { name: "title", label: "Default site title", type: "text" },
            { name: "description", label: "Default site description", type: "textarea" },
            uploadField(
              "ogImage",
              "Default social sharing image",
              "Used when a page has no image of its own (1200x630 works best).",
            ),
            uploadField("twitterImage", "X / Twitter card image", "Optional. Falls back to the sharing image."),
          ],
        },
      ],
    },
  ],
};
