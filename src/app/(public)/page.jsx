import { Suspense } from "react";

import HomeDynamicFallback from "@/features/publicSite/routes/home/HomeDynamicFallback.jsx";
import HomeDynamicSections from "@/features/publicSite/routes/home/HomeDynamicSections.jsx";
import HomeShell from "@/features/publicSite/routes/home/HomeShell.jsx";
import { getPageMetadata } from "@/lib/cms/metadata.js";
import { getSiteSettings } from "@/lib/cms/studio.js";

export async function generateMetadata() {
  const settings = await getSiteSettings();

  return {
    ...(await getPageMetadata({
      title: settings.seo.title,
      description: settings.seo.description,
      path: "/",
    })),
    title: {
      absolute: settings.seo.title,
    },
  };
}

export const revalidate = 30;

export default function Page() {
  return (
    <HomeShell>
      <Suspense fallback={<HomeDynamicFallback />}>
        <HomeDynamicSections />
      </Suspense>
    </HomeShell>
  );
}