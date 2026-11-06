export type YoutubeTrailer = {
  provider: "youtube";
  /** Add the YouTube video ID here. Leave empty to hide the trailer. */
  videoId: string;
};

export type StudioGame = {
  slug: string;
  title: string;
  /** Omit or leave empty to hide a status badge. */
  status?: string;
  /** Set featured to true to show this game on the homepage. Keep no more than 3 games featured. */
  featured?: boolean;
  shortDescription?: string;
  description?: string;
  logo?: string;
  heroImage?: string;
  ogImage?: string;
  trailer?: YoutubeTrailer;
  gallery?: string[];
  genre?: string;
  platforms?: string[];
  release?: string;
  developer?: string;
};

export const games: StudioGame[] = [
  {
    slug: "trek-bond",
    title: "Trek Bond",
    status: "In Development",
    featured: true,
    developer: "CrownForge Studio",
    shortDescription: "",
    description: "",
    logo: "",
    heroImage: "",
    trailer: { provider: "youtube", videoId: "" },
    gallery: [],
    genre: "",
    platforms: [],
    release: "",
  },
  {
    slug: "black-veil",
    title: "Black Veil",
    status: "In Development",
    featured: true,
    developer: "CrownForge Studio",
    shortDescription: "",
    description: "",
    logo: "",
    heroImage: "",
    trailer: { provider: "youtube", videoId: "" },
    gallery: [],
    genre: "",
    platforms: [],
    release: "",
  },
  {
    slug: "war-x",
    title: "War-X",
    featured: true,
    developer: "CrownForge Studio",
    shortDescription: "",
    description: "",
    logo: "",
    heroImage: "",
    trailer: { provider: "youtube", videoId: "" },
    gallery: [],
    genre: "",
    platforms: [],
    release: "",
  },
  {
    slug: "kingdom-of-mayana",
    title: "Kingdom of Mayana",
    status: "In Development",
    featured: false,
    developer: "CrownForge Studio",
    shortDescription: "",
    description: "",
    logo: "",
    heroImage: "",
    trailer: { provider: "youtube", videoId: "" },
    gallery: [],
    genre: "",
    platforms: [],
    release: "",
  },
];

function assertGamesConfig(list: StudioGame[]) {
  const slugs = list.map((game) => game.slug);
  if (slugs.some((slug) => !slug)) {
    throw new Error("Each game must have a slug.");
  }
  if (new Set(slugs).size !== slugs.length) {
    throw new Error("Game slugs must be unique.");
  }
  if (list.some((game) => !game.title)) {
    throw new Error("Each game must have a title.");
  }
}

assertGamesConfig(games);

export function getAllGames(): StudioGame[] {
  return games;
}

export function getGameBySlug(slug: string): StudioGame | undefined {
  return games.find((game) => game.slug === slug);
}

export function getFeaturedGames(limit = 3): StudioGame[] {
  return games.filter((game) => game.featured).slice(0, limit);
}

export function getGamePath(game: Pick<StudioGame, "slug">): string {
  return `/games/${game.slug}`;
}

export function hasTrailer(game: StudioGame): boolean {
  return Boolean(game.trailer?.provider === "youtube" && game.trailer.videoId?.trim());
}

export function getGallery(game: StudioGame): string[] {
  return (game.gallery || []).filter((src) => Boolean(src?.trim()));
}
