import { crownforgeConfig } from "@/config/crownforge.config";
import PostsIndex from "@/features/publicSite/content/PostsIndex.jsx";
import StudioInnerPage from "@/features/publicSite/layout/StudioInnerPage.jsx";
import { getPublishedDevelopmentUpdates } from "@/lib/cms/studioPosts.js";
import { getPageMetadata } from "@/lib/cms/metadata.js";

export async function generateMetadata() {
  return getPageMetadata({
    title: "Development Updates",
    description: crownforgeConfig.pages.development.description,
    path: "/development",
  });
}

export const revalidate = 30;

export default async function Page() {
  const posts = await getPublishedDevelopmentUpdates({ limit: 24 });

  return (
    <StudioInnerPage copy={crownforgeConfig.pages.development} headingId="development-page-heading">
      <PostsIndex
        posts={posts}
        variant="development"
        emptyMessage={crownforgeConfig.emptyStates.development}
      />
    </StudioInnerPage>
  );
}