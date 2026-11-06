import Link from "next/link";

export default function WorldEntryCard({ entry }) {
  const eyebrow = [entry.categoryLabel, entry.game?.title].filter(Boolean).join(" \u00b7 ");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-ggg-lg border border-ggg-border bg-ggg-panel transition-[transform,border-color] duration-200 hover:-translate-y-[3px] hover:border-ggg-border-strong">
      {entry.imageUrl ? (
        <div className="relative aspect-[4/3] overflow-hidden border-b border-ggg-border">
          <img
            src={entry.imageUrl}
            alt={entry.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-3 p-6">
        {eyebrow ? (
          <p className="m-0 font-mono text-[10px] uppercase tracking-[0.18em] text-ggg-accent">{eyebrow}</p>
        ) : null}
        <h3 className="m-0 font-bebas text-[22px] font-semibold tracking-[-0.01em] text-ggg-text [font-synthesis:weight_style]">
          {entry.name}
        </h3>
        {entry.shortDescription ? (
          <p className="m-0 line-clamp-3 text-ggg-body leading-[1.62] text-ggg-muted">{entry.shortDescription}</p>
        ) : null}
        <Link
          href={entry.href}
          className="mt-auto inline-flex items-center gap-2 self-start pt-2 text-[12px] font-bold uppercase tracking-[0.14em] text-ggg-text no-underline transition-[color,gap] duration-200 group-hover:gap-3 group-hover:text-ggg-accent"
        >
          View Details
          <span aria-hidden>{"\u2192"}</span>
        </Link>
      </div>
    </article>
  );
}