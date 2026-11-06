import GameGallery from "./GameGallery.jsx";
import GameHero from "./GameHero.jsx";
import GameInfo from "./GameInfo.jsx";
import GameTrailer from "./GameTrailer.jsx";
import ContactCta from "../sections/ContactCta/ContactCta.jsx";
import SectionHeading from "../shared/SectionHeading/SectionHeading.jsx";
import PageContainer from "../ui/PageContainer.jsx";
import WorldEntryGrid from "../world/WorldEntryGrid.jsx";

function WorldSection({ eyebrow, title, entries }) {
  if (!entries?.length) return null;

  return (
    <PageContainer as="section" className="py-12 sm:py-16">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className="mt-8">
        <WorldEntryGrid entries={entries} emptyMessage="" />
      </div>
    </PageContainer>
  );
}

export default function GamePage({ game, characters = [], objects = [] }) {
  return (
    <>
      <GameHero game={game} />
      <GameInfo game={game} />
      <GameTrailer game={game} />
      <GameGallery game={game} />
      <WorldSection eyebrow="World" title="Characters" entries={characters} />
      <WorldSection eyebrow="World" title="Objects & Assets" entries={objects} />
      <ContactCta />
    </>
  );
}