import { notFound } from "next/navigation";

import { crownforgeConfig } from "@/config/crownforge.config";
import GamePage from "@/features/publicSite/games/GamePage.jsx";
import PublicPageShell from "@/features/publicSite/layout/PublicPageShell.jsx";
import { getPageMetadata } from "@/lib/cms/metadata.js";
import {
  getCharactersForGame,
  getGameBySlug,
  getGames,
  getObjectsForGame,
} from "@/lib/cms/studio.js";

export const revalidate = 60;

export async function generateStaticParams() {
  const games = await getGames();
  return games.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) {
    return { title: "Game not found" };
  }

  const description =
    game.meta.description ||
    game.shortDescription ||
    game.description ||
    `${game.title} from ${crownforgeConfig.studioName}.`;

  return getPageMetadata({
    title: game.meta.title || game.title,
    description,
    path: `/games/${game.slug}`,
    image: game.ogImage || game.heroImage || game.coverImage || undefined,
  });
}

export default async function Page({ params }) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) {
    notFound();
  }

  const [characters, objects] = await Promise.all([
    getCharactersForGame(game.id),
    getObjectsForGame(game.id),
  ]);

  return (
    <PublicPageShell>
      <main id="main-content">
        <GamePage game={game} characters={characters} objects={objects} />
      </main>
    </PublicPageShell>
  );
}