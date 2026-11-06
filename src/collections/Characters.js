import { createWorldEntryCollection } from "./worldEntries.js";
import { CHARACTER_CATEGORY_OPTIONS } from "./shared.js";

/** @type {import("payload").CollectionConfig} */
export const Characters = createWorldEntryCollection({
  slug: "characters",
  labels: { singular: "Character", plural: "Characters" },
  basePath: "/characters",
  categoryOptions: CHARACTER_CATEGORY_OPTIONS,
  categoryLabel: "Character type",
  description: "Characters from CrownForge games. Publishing a character creates its page automatically.",
});