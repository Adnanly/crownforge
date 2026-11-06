import { adminsOnly, isAdmin, visibleOrAuthenticated } from "../lib/payload/access.js";
import { orderField, revalidationHooks, uploadField } from "./shared.js";
import { validateOptionalUrl } from "../lib/youtube.js";

const socialField = (name, label) => ({
  name,
  label,
  type: "text",
  validate: validateOptionalUrl,
  admin: { placeholder: "https://" },
});

/** @type {import("payload").CollectionConfig} */
export const TeamMembers = {
  slug: "team-members",
  labels: { singular: "Team member", plural: "Team" },
  admin: {
    useAsTitle: "name",
    group: "Studio",
    description: "Team member records. These are kept in the CMS but are not shown on the public website.",
    defaultColumns: ["name", "role", "displayOrder", "visible"],
    listSearchableFields: ["name", "role"],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: visibleOrAuthenticated,
    update: isAdmin,
  },
  hooks: {
    ...adminsOnly,
    ...revalidationHooks({ listPath: "/team" }),
  },
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "role", label: "Role", type: "text", required: true, admin: { description: "For example: Founder." } },
    uploadField("image", "Profile image", "Optional. Initials are shown when there is no image."),
    {
      name: "bio",
      label: "Short bio",
      type: "textarea",
      admin: { description: "Optional. Leave empty to hide." },
    },
    {
      name: "social",
      label: "Social links",
      type: "group",
      admin: { description: "Optional. Only links that are filled in are shown." },
      fields: [
        socialField("x", "X / Twitter"),
        socialField("instagram", "Instagram"),
        socialField("linkedin", "LinkedIn"),
        socialField("github", "GitHub"),
        socialField("website", "Website"),
      ],
    },
    orderField("displayOrder", "Display order", "Lower numbers appear first."),
    {
      name: "visible",
      label: "Show on website",
      type: "checkbox",
      defaultValue: true,
      admin: { description: "Untick to hide this person without deleting them." },
    },
  ],
};