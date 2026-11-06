import { crownforgeConfig } from "@/config/crownforge.config";
import {
  getPublishedDevelopmentUpdates,
  getPublishedNews,
} from "@/lib/cms/studioPosts.js";
import HomeFeedSection from "../../sections/HomeFeed/HomeFeedSection.jsx";
import FadeIn from "../../shared/FadeIn/FadeIn.jsx";

const dividerClass = "h-px w-full bg-ggg-border";

export default async function HomeDynamicSections() {
  const [news, development] = await Promise.all([
    getPublishedNews({ limit: 3 }),
    getPublishedDevelopmentUpdates({ limit: 3 }),
  ]);

  const { homeNews, homeDevelopment, emptyStates } = crownforgeConfig;

  return (
    <>
      <FadeIn>
        <HomeFeedSection
          eyebrow={homeDevelopment.eyebrow}
          title={homeDevelopment.title}
          body={homeDevelopment.body}
          ctaLabel={homeDevelopment.ctaLabel}
          href={homeDevelopment.href}
          posts={development}
          emptyMessage={emptyStates.development}
          variant="development"
        />
      </FadeIn>
      <div className={dividerClass} role="presentation" aria-hidden />
      <FadeIn>
        <HomeFeedSection
          eyebrow={homeNews.eyebrow}
          title={homeNews.title}
          body={homeNews.body}
          ctaLabel={homeNews.ctaLabel}
          href={homeNews.href}
          posts={news}
          emptyMessage={emptyStates.news}
          variant="news"
        />
      </FadeIn>
      <div className={dividerClass} role="presentation" aria-hidden />
    </>
  );
}
