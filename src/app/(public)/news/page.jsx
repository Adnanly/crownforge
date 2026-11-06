import { crownforgeConfig } from "@/config/crownforge.config";
import PostsIndex from "@/features/publicSite/content/PostsIndex.jsx";
import StudioInnerPage from "@/features/publicSite/layout/StudioInnerPage.jsx";
import { getPublishedNews } from "@/lib/cms/studioPosts.js";
import { getPageMetadata } from "@/lib/cms/metadata.js";

export async function generateMetadata() {
  return getPageMetadata({
    title: "News",
    description: crownforgeConfig.pages.news.description,
    path: "/news",
  });
}

export const revalidate = 30;

export default async function Page() {
  const posts = await getPublishedNews({ limit: 24 });

  return (
    <StudioInnerPage copy={crownforgeConfig.pages.news} headingId="news-page-heading">
      <PostsIndex posts={posts} variant="news" emptyMessage={crownforgeConfig.emptyStates.news} />
    </StudioInnerPage>
  );
}