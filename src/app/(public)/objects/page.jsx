import { crownforgeConfig } from "@/config/crownforge.config";
import StudioInnerPage from "@/features/publicSite/layout/StudioInnerPage.jsx";
import WorldEntryGrid from "@/features/publicSite/world/WorldEntryGrid.jsx";
import { getPageMetadata } from "@/lib/cms/metadata.js";
import { getObjects } from "@/lib/cms/studio.js";

export async function generateMetadata() {
  return getPageMetadata({
    title: "Objects & Assets",
    description: crownforgeConfig.pages.objects.description,
    path: "/objects",
  });
}

export const revalidate = 60;

export default async function Page() {
  const entries = await getObjects();

  return (
    <StudioInnerPage copy={crownforgeConfig.pages.objects} headingId="objects-page-heading">
      <WorldEntryGrid entries={entries} emptyMessage={crownforgeConfig.emptyStates.objects} />
    </StudioInnerPage>
  );
}