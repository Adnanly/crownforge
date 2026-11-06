import { notFound } from "next/navigation";

import { crownforgeConfig } from "@/config/crownforge.config";
import PostArticle from "@/features/publicSite/content/PostArticle.jsx";
import PublicPageShell from "@/features/publicSite/layout/PublicPageShell.jsx";
import {
  getDevelopmentUpdateBySlug,
  getPublishedDevelopmentUpdates,
} from "@/lib/cms/studioPosts.js";
import { getPageMetadata } from "@/lib/cms/metadata.js";

export const revalidate = 30;

export async function generateStaticParams() {
  const posts = await getPublishedDevelopmentUpdates({ limit: 100 });
  return posts.filter((post) => post?.slug).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getDevelopmentUpdateBySlug(slug);
  if (!post) {
    return { title: "Update not found" };
  }

  return getPageMetadata({
    title: post.meta.title || post.title,
    description: post.meta.description || post.excerpt || crownforgeConfig.pages.development.description,
    path: post.href,
    image: post.meta.image || post.coverUrl,
  });
}

export default async function Page({ params }) {
  const { slug } = await params;
  const post = await getDevelopmentUpdateBySlug(slug);
  if (!post) {
    notFound();
  }

  return (
    <PublicPageShell>
      <main id="main-content">
        <PostArticle
          post={post}
          backHref="/development"
          backLabel="All development updates"
          variant="development"
        />
      </main>
    </PublicPageShell>
  );
}
