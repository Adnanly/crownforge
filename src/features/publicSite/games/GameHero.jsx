import Link from "next/link";

import { hasTrailer } from "@/config/games.config";
import Button from "../ui/Button.jsx";
import PageContainer from "../ui/PageContainer.jsx";
import SplitText from "../shared/SplitText/SplitText.jsx";
import FadeIn from "../shared/FadeIn/FadeIn.jsx";

export default function GameHero({ game }) {
  const trailer = hasTrailer(game);

  return (
    <section className="relative overflow-hidden pb-12 pt-[120px] sm:pb-16 lg:pb-20">
      {game.heroImage ? (
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          <img
            src={game.heroImage}
            alt=""
            className="h-full w-full object-cover object-center opacity-35 saturate-75"
            decoding="async"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(9,9,9,1)_0%,rgba(9,9,9,0.55)_45%,rgba(9,9,9,0.2)_100%)]" />
        </div>
      ) : (
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_55%_at_65%_35%,oklch(28%_0.08_85_/_0.28)_0%,transparent_65%)]"
          aria-hidden
        />
      )}

      <PageContainer className="relative z-[2]">
        <Link
          className="mb-8 inline-flex items-center gap-2 text-xs font-medium tracking-[0.02em] text-ggg-muted transition-colors hover:text-white"
          href="/games"
        >
          <span aria-hidden>←</span>
          All games
        </Link>

        {game.logo ? (
          <img src={game.logo} alt="" className="mb-6 h-16 w-auto object-contain sm:h-20" />
        ) : null}

        {game.status ? (
          <p className="mb-4 inline-flex items-center rounded-full bg-ggg-accent px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0a0a0a]">
            {game.status}
          </p>
        ) : null}

        <h1 className="m-0 max-w-[16ch] font-bebas text-[clamp(40px,8vw,80px)] font-bold uppercase leading-[0.88] tracking-[0.01em] text-ggg-text [font-synthesis:weight_style]">
          <SplitText text={game.title} immediate />
        </h1>

        {game.shortDescription || game.description ? (
          <FadeIn
            as="p"
            immediate
            delay={400}
            className="mt-6 max-w-[520px] text-[17px] leading-[1.6] text-ggg-muted"
          >
            {game.shortDescription || game.description}
          </FadeIn>
        ) : null}

        <FadeIn immediate delay={600} className="mt-8 flex flex-wrap gap-3">
          {trailer ? (
            <Button as="a" href="#trailer" variant="primary">
              Watch Trailer
            </Button>
          ) : null}
          <Button as={Link} href="/contact" variant="ghost">
            Contact CrownForge
          </Button>
        </FadeIn>
      </PageContainer>
    </section>
  );
}
