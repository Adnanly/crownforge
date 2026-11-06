import Link from "next/link";

import { FEATURED_GAMES_LIMIT, crownforgeConfig } from "@/config/crownforge.config";
import { getFeaturedGames } from "@/lib/cms/studio.js";
import StudioGameCard from "../../shared/GameCard/StudioGameCard.jsx";
import SectionHeading from "../../shared/SectionHeading/SectionHeading.jsx";
import Button from "../../ui/Button.jsx";
import PageContainer from "../../ui/PageContainer.jsx";
import { orderGamesForCenter, tabletOrder } from "../TopTitles/showcaseLayout.js";

const ambienceWashClass =
  "pointer-events-none absolute left-1/2 top-1/2 hidden h-[74%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_52%_72%_at_50%_50%,oklch(62%_0.12_85_/_0.08)_0%,oklch(62%_0.12_85_/_0.04)_28%,transparent_62%)] blur-3xl sm:block";

export default async function FeaturedGames() {
  const games = await getFeaturedGames(FEATURED_GAMES_LIMIT);
  const { featuredGames } = crownforgeConfig;
  if (!games.length) return null;

  const podium = orderGamesForCenter(games);

  return (
    <PageContainer as="section" id="games" className="relative py-16 sm:py-20 lg:py-[100px]">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-x-3 gap-y-3 sm:mb-10 sm:gap-x-6">
        <SectionHeading title={featuredGames.heading} />
        <Button
          as={Link}
          href="/games"
          variant="primary"
          className="shrink-0 whitespace-nowrap px-5.5 py-2.5 text-xs max-[380px]:px-3 max-[380px]:py-2 max-[380px]:text-[10px]"
        >
          {featuredGames.viewAllLabel}
          <span aria-hidden className="hidden sm:inline">
            {" "}
            →
          </span>
        </Button>
      </div>

      <div className="relative overflow-visible pb-2">
        <div className={ambienceWashClass} aria-hidden />

        <div className="relative z-[1] mx-auto hidden items-end gap-4 lg:flex">
          {podium.map((game, index) => (
            <StudioGameCard
              key={game.slug}
              game={game}
              source="home_showcase"
              showcaseSlot={index === Math.floor(podium.length / 2) ? "hero" : "inner"}
            />
          ))}
        </div>

        <div className="relative z-[1] hidden grid-cols-3 items-end gap-4 sm:grid lg:hidden">
          {tabletOrder(games).map((game, index) => (
            <StudioGameCard
              key={game.slug}
              game={game}
              source="home_showcase"
              showcaseSlot={index === 1 ? "hero" : "inner"}
            />
          ))}
        </div>

        <div className="relative z-[1] -mx-ggg flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-ggg pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:hidden">
          {games.map((game, index) => (
            <div key={game.slug} className="flex shrink-0 snap-center basis-[72%] max-[380px]:basis-[80%]">
              <StudioGameCard
                game={game}
                source="home_showcase"
                showcaseSlot={index === 0 ? "mobileLead" : "stack"}
              />
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
