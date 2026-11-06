import Link from "next/link";

import StudioRichText from "./StudioRichText.jsx";
import PageContainer from "../ui/PageContainer.jsx";
import ContactCta from "../sections/ContactCta/ContactCta.jsx";
import SectionHeading from "../shared/SectionHeading/SectionHeading.jsx";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function PostArticle({ post, backHref, backLabel, variant = "news" }) {
  const dateLabel = formatDate(post.publishedAt);
  const kind = variant === "development" ? "Development" : "News";

  return (
    <>
      <PageContainer as="article" className="pb-16 pt-[calc(70px+clamp(24px,4vw,48px))]">
        <Link
          className="mb-8 inline-flex items-center gap-2 text-xs font-medium tracking-[0.02em] text-ggg-muted transition-colors hover:text-white"
          href={backHref}
        >
          <span aria-hidden>←</span>
          {backLabel}
        </Link>
        <p className="m-0 font-mono text-[10px] uppercase tracking-[0.18em] text-ggg-accent">
          {kind}
          {dateLabel ? ` · ${dateLabel}` : ""}
          {post.authorName ? ` · ${post.authorName}` : ""}
        </p>
        <h1 className="mt-4 max-w-[18ch] font-bebas text-[clamp(34px,7vw,64px)] font-bold uppercase leading-[0.9] text-ggg-text [font-synthesis:weight_style]">
          {post.title}
        </h1>
        {post.categoryLabel || post.relatedGame ? (
          <p className="mt-4 m-0 text-[15px] text-ggg-muted">
            {post.categoryLabel ? (
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ggg-accent">
                {post.categoryLabel}
              </span>
            ) : null}
            {post.categoryLabel && post.relatedGame ? <span aria-hidden>{" \u00b7 "}</span> : null}
            {post.relatedGame ? (
              <>
                About{" "}
                <Link className="text-ggg-accent underline underline-offset-4" href={post.relatedGame.href}>
                  {post.relatedGame.title}
                </Link>
              </>
            ) : null}
          </p>
        ) : null}
        {post.excerpt ? (
          <p className="mt-6 max-w-[640px] text-[18px] leading-[1.6] text-ggg-muted">{post.excerpt}</p>
        ) : null}
        {post.coverUrl ? (
          <img
            src={post.coverUrl}
            alt=""
            className="mt-10 w-full rounded-ggg-lg border border-ggg-border object-cover"
          />
        ) : null}
        <div className="mt-10">
          <StudioRichText content={post.content} />
        </div>
        {post.videoId ? (
          <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-ggg-lg border border-ggg-border bg-black">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(post.videoId)}`}
              title={`${post.title} video`}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        ) : null}
        {post.gallery?.length ? (
          <div className="mt-12">
            <SectionHeading eyebrow="Artwork" title="Gallery" />
            <ul className="mt-8 grid list-none grid-cols-1 gap-4 p-0 m-0 sm:grid-cols-2">
              {post.gallery.map((src, index) => (
                <li key={src} className="overflow-hidden rounded-ggg-lg border border-ggg-border bg-ggg-panel">
                  <img
                    src={src}
                    alt={`${post.title} image ${index + 1}`}
                    className="block h-auto w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </PageContainer>
      <ContactCta />
    </>
  );
}
