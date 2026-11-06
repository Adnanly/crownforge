import { createWorldEntryCollection } from "./worldEntries.js";
import { OBJECT_CATEGORY_OPTIONS } from "./shared.js";

/** Objects / assets such as props, vehicles, buildings and environment pieces. @type {import("payload").CollectionConfig} */
export const WorldObjects = createWorldEntryCollection({
  slug: "objects",
  labels: { singular: "Object / Asset", plural: "Objects & Assets" },
  basePath: "/objects",
  categoryOptions: OBJECT_CATEGORY_OPTIONS,
  categoryLabel: "Category",
  description: "Props, vehicles, buildings and other assets. Publishing an object creates its page automatically.",
});