import { createLlmsText } from "@/lib/agent/llms.js";
import { getSiteSettings, getWorldNavigation } from "@/lib/cms/studio.js";

export const revalidate = 3600;

const WORLD_SUMMARIES = {
  "/characters": "Characters from CrownForge Studio games.",
  "/objects": "Objects and assets from CrownForge Studio games.",
};

export async function GET() {
  const [settings, world] = await Promise.all([getSiteSettings(), getWorldNavigation()]);
  const worldLinks = world.map((item) => ({ ...item, summary: WORLD_SUMMARIES[item.href] || "" }));

  return new Response(createLlmsText(undefined, { settings, worldLinks }), {
    headers: {
      "Cache-Control": "public, max-age=3600, must-revalidate",
      "Content-Type": "text/plain; charset=utf-8",
      Link: "</llms.txt>; rel=\"self\"",
    },
  });
}