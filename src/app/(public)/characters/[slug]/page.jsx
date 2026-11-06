import { notFound } from "next/navigation";

import { crownforgeConfig } from "@/config/crownforge.config";
import PublicPageShell from "@/features/publicSite/layout/PublicPageShell.jsx";
import WorldEntryDetail from "@/features/publicSite/world/WorldEntryDetail.jsx";
import { getPageMetadata } from "@/lib/cms/metadata.js";
import { getCharacters, getCharacterBySlug } from "@/lib/cms/studio.js";

export const revalidate = 60;

export async function generateStaticParams() {
  const entries = await getCharacters();
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const entry = await getCharacterBySlug(slug);
  if (!entry) {
    return { title: "Character not found" };
  }

  return getPageMetadata({
    title: entry.meta.title || entry.name,
    description:
      entry.meta.description ||
      entry.shortDescription ||
      entry.description ||
      crownforgeConfig.pages.characters.description,
    path: entry.href,
    image: entry.meta.image || undefined,
  });
}

export default async function Page({ params }) {
  const { slug } = await params;
  const entry = await getCharacterBySlug(slug);
  if (!entry) {
    notFound();
  }

  return (
    <PublicPageShell>
      <main id="main-content">
        <WorldEntryDetail entry={entry} backHref="/characters" backLabel="All characters" />
      </main>
    </PublicPageShell>
  );
}