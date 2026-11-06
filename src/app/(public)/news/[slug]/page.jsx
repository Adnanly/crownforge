import { notFound } from "next/navigation";

import { crownforgeConfig } from "@/config/crownforge.config";
import PostArticle from "@/features/publicSite/content/PostArticle.jsx";
import PublicPageShell from "@/features/publicSite/layout/PublicPageShell.jsx";
import { getNewsBySlug, getPublishedNews } from "@/lib/cms/studioPosts.js";
import { getPageMetadata } from "@/lib/cms/metadata.js";

export const revalidate = 30;

export async function generateStaticParams() {
  const posts = await getPublishedNews({ limit: 100 });
  return posts.filter((post) => post?.slug).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  if (!post) {
    return { title: "News not found" };
  }

  return getPageMetadata({
    title: post.meta.title || post.title,
    description: post.meta.description || post.excerpt || crownforgeConfig.pages.news.description,
    path: post.href,
    image: post.meta.image || post.coverUrl,
  });
}

export default async function Page({ params }) {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  if (!post) {
    notFound();
  }

  return (
    <PublicPageShell>
      <main id="main-content">
        <PostArticle post={post} backHref="/news" backLabel="All news" variant="news" />
      </main>
    </PublicPageShell>
  );
}
