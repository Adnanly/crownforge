import { crownforgeConfig } from "@/config/crownforge.config";
import GamesGrid from "@/features/publicSite/routes/games/GamesGrid.jsx";
import StudioInnerPage from "@/features/publicSite/layout/StudioInnerPage.jsx";
import { getPageMetadata } from "@/lib/cms/metadata.js";

export async function generateMetadata() {
  return getPageMetadata({
    title: "Games",
    description: crownforgeConfig.pages.games.description,
    path: "/games",
  });
}

export const revalidate = 60;

export default function Page() {
  return (
    <StudioInnerPage copy={crownforgeConfig.pages.games} headingId="games-page-heading">
      <GamesGrid />
    </StudioInnerPage>
  );
}