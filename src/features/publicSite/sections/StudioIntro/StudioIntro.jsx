import { getSiteSettings } from "@/lib/cms/studio.js";
import FadeIn from "../../shared/FadeIn/FadeIn.jsx";
import SectionHeading from "../../shared/SectionHeading/SectionHeading.jsx";
import PageContainer from "../../ui/PageContainer.jsx";

export default async function StudioIntro() {
  const { studioIntro } = await getSiteSettings();

  return (
    <PageContainer as="section" className="py-16 sm:py-20 lg:py-[72px]" aria-labelledby="studio-intro-heading">
      <FadeIn>
        <SectionHeading
          headingId="studio-intro-heading"
          eyebrow={studioIntro.eyebrow}
          title={studioIntro.title}
          body={studioIntro.body}
        />
      </FadeIn>
    </PageContainer>
  );
}
