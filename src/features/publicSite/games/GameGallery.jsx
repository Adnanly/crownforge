import { getGallery } from "@/config/games.config";
import PageContainer from "../ui/PageContainer.jsx";
import SectionHeading from "../shared/SectionHeading/SectionHeading.jsx";

export default function GameGallery({ game }) {
  const images = getGallery(game);
  if (!images.length) return null;

  return (
    <PageContainer as="section" className="py-12 sm:py-16">
      <SectionHeading eyebrow="Artwork" title="Gallery" />
      <ul className="mt-8 grid list-none grid-cols-1 gap-4 p-0 m-0 sm:grid-cols-2">
        {images.map((src, index) => (
          <li key={src} className="overflow-hidden rounded-ggg-lg border border-ggg-border bg-ggg-panel">
            <img
              src={src}
              alt={`${game.title} artwork ${index + 1}`}
              className="block h-auto w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}
