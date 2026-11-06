import { createPageMetadata } from "@/lib/site.js";
import { getSiteSettings } from "@/lib/cms/studio.js";

/** Page metadata that honours Website Settings (site name, default description, default social image). */
export async function getPageMetadata(options = {}) {
  const settings = await getSiteSettings();
  return createPageMetadata({ ...options, settings });
}