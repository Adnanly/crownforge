import { getGames } from "@/lib/cms/studio.js";
import { crownforgeConfig } from "@/config/crownforge.config";
import FadeIn from "../../shared/FadeIn/FadeIn.jsx";
import StudioGameCard from "../../shared/GameCard/StudioGameCard.jsx";
import StateCard from "../../ui/StateCard.jsx";
import { GAMES_GALLERY_GRID_CLASS } from "./GamesGallerySkeleton.jsx";

const FADE_DELAY_STEP_MS = 60;
const FADE_DELAY_MAX_INDEX = 7;

const fadeDelay = (index) => Math.min(index, FADE_DELAY_MAX_INDEX) * FADE_DELAY_STEP_MS;

export default async function GamesGrid() {
  const games = await getGames();

  if (!games.length) {
    return <StateCard>{crownforgeConfig.emptyStates.games}</StateCard>;
  }

  return (
    <div className={GAMES_GALLERY_GRID_CLASS} aria-labelledby="games-page-heading">
      {games.map((game, index) => (
        <FadeIn key={game.slug} variant="pop" delay={fadeDelay(index)} immediate>
          <StudioGameCard game={game} source="games_grid" showcaseSlot="stack" />
        </FadeIn>
      ))}
    </div>
  );
}
