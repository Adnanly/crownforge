import Link from "next/link";

import ContactCta from "../sections/ContactCta/ContactCta.jsx";
import PageContainer from "../ui/PageContainer.jsx";
import SectionHeading from "../shared/SectionHeading/SectionHeading.jsx";

function paragraphs(value) {
  return String(value || "")
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export default function WorldEntryDetail({ entry, backHref, backLabel }) {
  const eyebrow = [entry.categoryLabel, entry.statusLabel].filter(Boolean).join(" \u00b7 ");
  const body = paragraphs(entry.description);

  return (
    <>
      <PageContainer as="article" className="pb-16 pt-[calc(70px+clamp(24px,4vw,48px))]">
        <Link
          className="mb-8 inline-flex items-center gap-2 text-xs font-medium tracking-[0.02em] text-ggg-muted transition-colors hover:text-white"
          href={backHref}
        >
          <span aria-hidden>{"\u2190"}</span>
          {backLabel}
        </Link>
        {eyebrow ? (
          <p className="m-0 font-mono text-[10px] uppercase tracking-[0.18em] text-ggg-accent">{eyebrow}</p>
        ) : null}
        <h1 className="mt-4 max-w-[18ch] font-bebas text-[clamp(34px,7vw,64px)] font-bold uppercase leading-[0.9] text-ggg-text [font-synthesis:weight_style]">
          {entry.name}
        </h1>
        {entry.game ? (
          <p className="mt-4 m-0 text-[15px] text-ggg-muted">
            From{" "}
            <Link className="text-ggg-accent underline underline-offset-4" href={entry.game.href}>
              {entry.game.title}
            </Link>
          </p>
        ) : null}
        {entry.shortDescription ? (
          <p className="mt-6 max-w-[640px] text-[18px] leading-[1.6] text-ggg-muted">{entry.shortDescription}</p>
        ) : null}
        {entry.imageUrl ? (
          <img
            src={entry.imageUrl}
            alt={entry.name}
            className="mt-10 w-full rounded-ggg-lg border border-ggg-border object-cover"
          />
        ) : null}
        {body.length ? (
          <div className="mt-10 max-w-[720px]">
            {body.map((part, index) => (
              <p key={index} className="my-4 whitespace-pre-line text-ggg-body leading-[1.75] text-ggg-muted">
                {part}
              </p>
            ))}
          </div>
        ) : null}
      </PageContainer>

      {entry.gallery.length ? (
        <PageContainer as="section" className="pb-16">
          <SectionHeading eyebrow="Artwork" title="Gallery" />
          <ul className="mt-8 grid list-none grid-cols-1 gap-4 p-0 m-0 sm:grid-cols-2">
            {entry.gallery.map((src, index) => (
              <li key={src} className="overflow-hidden rounded-ggg-lg border border-ggg-border bg-ggg-panel">
                <img
                  src={src}
                  alt={`${entry.name} image ${index + 1}`}
                  className="block h-auto w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </li>
            ))}
          </ul>
        </PageContainer>
      ) : null}
      <ContactCta />
    </>
  );
}