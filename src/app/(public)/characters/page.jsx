import { crownforgeConfig } from "@/config/crownforge.config";
import StudioInnerPage from "@/features/publicSite/layout/StudioInnerPage.jsx";
import WorldEntryGrid from "@/features/publicSite/world/WorldEntryGrid.jsx";
import { getPageMetadata } from "@/lib/cms/metadata.js";
import { getCharacters } from "@/lib/cms/studio.js";

export async function generateMetadata() {
  return getPageMetadata({
    title: "Characters",
    description: crownforgeConfig.pages.characters.description,
    path: "/characters",
  });
}

export const revalidate = 60;

export default async function Page() {
  const entries = await getCharacters();

  return (
    <StudioInnerPage copy={crownforgeConfig.pages.characters} headingId="characters-page-heading">
      <WorldEntryGrid entries={entries} emptyMessage={crownforgeConfig.emptyStates.characters} />
    </StudioInnerPage>
  );
}