import { crownforgeConfig } from "./crownforge.config";
import { games } from "./games.config";
import { teamMembers } from "./team.config";

export function validateCrownForgeConfig() {
  if (!crownforgeConfig.studioName) {
    throw new Error("crownforgeConfig.studioName is required.");
  }
  if (!crownforgeConfig.navigation?.length) {
    throw new Error("crownforgeConfig.navigation must include at least one item.");
  }
  for (const item of crownforgeConfig.navigation) {
    if (!item.label || !item.href) {
      throw new Error("Each navigation item needs a label and href.");
    }
  }
  if (!games.length) {
    throw new Error("At least one game is required in games.config.ts.");
  }
  const seenSlugs = new Set<string>();
  for (const game of games) {
    if (!game.title?.trim()) {
      throw new Error(`Every game in games.config.ts needs a title (slug: "${game.slug}").`);
    }
    if (!game.slug?.trim()) {
      throw new Error(`Game "${game.title}" in games.config.ts needs a slug.`);
    }
    if (seenSlugs.has(game.slug)) {
      throw new Error(`Duplicate game slug in games.config.ts: "${game.slug}".`);
    }
    seenSlugs.add(game.slug);
  }
  if (!teamMembers.length) {
    throw new Error("At least one team member is required in team.config.ts.");
  }
}

validateCrownForgeConfig();
