import Link from "next/link";

import Button from "../../ui/Button.jsx";
import PageContainer from "../../ui/PageContainer.jsx";
import SectionHeading from "../../shared/SectionHeading/SectionHeading.jsx";
import StateCard from "../../ui/StateCard.jsx";
import NewsCard from "../news/NewsCard.jsx";

export default function HomeFeedSection({
  eyebrow,
  title,
  body,
  ctaLabel,
  href,
  posts,
  emptyMessage,
  variant = "news",
}) {
  return (
    <PageContainer as="section" className="py-16 sm:py-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
        <SectionHeading eyebrow={eyebrow} title={title} body={body} />
        <Button as={Link} href={href} variant="ghost" className="shrink-0">
          {ctaLabel}
        </Button>
      </div>
      {posts.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <NewsCard key={post.id} post={post} variant={variant} />
          ))}
        </div>
      ) : (
        <StateCard>{emptyMessage}</StateCard>
      )}
    </PageContainer>
  );
}
