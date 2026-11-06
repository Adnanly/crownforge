import Link from "next/link";

import { cn } from "../../../../lib/utils.js";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function NewsCard({ post, variant = "news" }) {
  const dateLabel = formatDate(post.publishedAt);
  const isDev = variant === "development";

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-ggg-lg border border-ggg-border bg-ggg-panel transition-[transform,border-color] duration-200 hover:-translate-y-[3px] hover:border-ggg-border-strong",
        isDev && "border-ggg-accent-border",
      )}
    >
      {post.coverUrl ? (
        <div className="relative aspect-[16/9] overflow-hidden border-b border-ggg-border">
          <img
            src={post.coverUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className="m-0 font-mono text-[10px] uppercase tracking-[0.18em] text-ggg-accent">
          {isDev ? "Development" : "News"}
          {dateLabel ? ` · ${dateLabel}` : ""}
        </p>
        <h3 className="m-0 font-bebas text-[22px] font-bold uppercase tracking-[0.04em] text-ggg-text [font-synthesis:weight_style]">
          {post.title}
        </h3>
        {post.excerpt ? <p className="m-0 text-ggg-body leading-[1.62] text-ggg-muted">{post.excerpt}</p> : null}
        <Link
          href={post.href}
          className="mt-auto inline-flex items-center gap-2 self-start pt-2 text-[12px] font-bold uppercase tracking-[0.14em] text-ggg-text no-underline transition-[color,gap] duration-200 group-hover:gap-3 group-hover:text-ggg-accent"
        >
          Read More
          <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}
