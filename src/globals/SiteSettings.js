import { globalAccess } from "../lib/payload/access.js";

/** @type {import("payload").GlobalConfig} */
export const SiteSettings = {
  slug: "site-settings",
  admin: { group: "Legacy", hidden: true, description: "Legacy content. Use 'Website Settings' instead." },
  access: globalAccess,
  fields: [
    {
      name: "site",
      type: "json",
      required: true,
      admin: {
        description: "Site-wide metadata: name, contact email, copyright text, and related identity.",
      },
    },
  ],
};
