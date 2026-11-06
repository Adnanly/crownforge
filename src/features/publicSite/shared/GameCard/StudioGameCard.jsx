"use client";

import Link from "next/link";
import posthog from "posthog-js";
import { cn } from "../../../../lib/utils.js";

import { getGamePath } from "@/config/games.config";
import {
  featuredShadow,
  slotSizing,
  slotTint,
  standardShadow,
} from "./showcaseStyles.js";

const StudioGameCard = ({ game, showcaseSlot = "stack", source = "games_grid" }) => {
  const href = getGamePath(game);
  const image = game.coverImage || game.heroImage || game.logo;
  const showsBadge = showcaseSlot === "hero" || showcaseSlot === "mobileLead";
  const usesHeroChrome = showcaseSlot === "hero";

  return (
    <Link
      className={cn(
        "group relative flex min-w-0 cursor-pointer flex-col items-stretch text-inherit no-underline",
        slotSizing[showcaseSlot] ?? slotSizing.stack,
      )}
      href={href}
      onClick={() =>
        posthog.capture("game_card_clicked", {
          game_name: game.title,
          game_slug: game.slug,
          source,
          showcase_slot: showcaseSlot,
        })
      }
    >
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-ggg-md bg-[#111] transition-[transform,box-shadow] duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[10px]",
          standardShadow,
          showsBadge && "rounded-ggg-lg group-hover:-translate-y-3",
          usesHeroChrome && featuredShadow,
        )}
      >
        {image ? (
          <img
            className="block aspect-square h-auto w-full object-cover transition-transform duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
            src={image}
            alt={game.title}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center bg-[repeating-linear-gradient(-45deg,rgba(255,255,255,0.013)_0_1px,transparent_1px_18px)] px-3 text-center font-mono text-[10px] leading-[1.5] text-white/[0.12]">
            [ {game.title} ]
          </div>
        )}

        <div
          className={cn(
            "pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_22%,rgba(0,0,0,0.08)_46%,rgba(0,0,0,0.42)_68%,rgba(0,0,0,0.92)_100%)]",
            showsBadge &&
              "bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_14%,rgba(0,0,0,0.06)_38%,rgba(0,0,0,0.34)_58%,rgba(0,0,0,0.94)_100%)]",
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-0 z-[2] opacity-100 mix-blend-screen",
            slotTint[showcaseSlot] ?? slotTint.stack,
          )}
        />

        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-[4] flex flex-col items-start gap-1.5 p-3.5 pb-4",
            showsBadge && "p-4.5 pb-5",
          )}
        >
          {game.status ? (
            <div className="mb-1 inline-flex items-center gap-[5px] rounded-full bg-ggg-accent px-2.5 py-[3px] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0a0a0a]">
              {game.status}
            </div>
          ) : null}

          <div className={cn("max-w-full", showsBadge && "max-w-[82%]")}>
            <div
              className={cn(
                "line-clamp-2 text-ggg-body-xs font-extrabold leading-[1.18] tracking-[0.01em] text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.95),0_0_1px_rgba(0,0,0,0.9)]",
                showsBadge && "text-ggg-body",
              )}
            >
              {game.title}
            </div>
            {game.shortDescription ? (
              <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-white/70">{game.shortDescription}</p>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StudioGameCard;
