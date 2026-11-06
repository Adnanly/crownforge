import { hasTrailer } from "@/config/games.config";
import PageContainer from "../ui/PageContainer.jsx";
import SectionHeading from "../shared/SectionHeading/SectionHeading.jsx";

export default function GameTrailer({ game }) {
  if (!hasTrailer(game)) return null;

  const videoId = game.trailer.videoId.trim();

  return (
    <PageContainer as="section" id="trailer" className="py-12 sm:py-16">
      <SectionHeading eyebrow="Trailer" title={`Watch ${game.title}`} />
      <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-ggg-lg border border-ggg-border bg-black">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`}
          title={`${game.title} trailer`}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </PageContainer>
  );
}
