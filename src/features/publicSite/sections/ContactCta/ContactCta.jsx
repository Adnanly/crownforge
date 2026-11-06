import Link from "next/link";

import Button from "../../ui/Button.jsx";
import PageContainer from "../../ui/PageContainer.jsx";
import SplitText from "../../shared/SplitText/SplitText.jsx";
import FadeIn from "../../shared/FadeIn/FadeIn.jsx";
import { crownforgeConfig } from "@/config/crownforge.config";

export default function ContactCta() {
  const { contactCta } = crownforgeConfig;
  const [lead, accent] = contactCta.titleLines;

  return (
    <section className="relative overflow-hidden py-20 sm:py-24 min-[1224px]:py-[120px]">
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_50%_55%_at_24%_52%,oklch(32%_0.1_85_/_0.28)_0%,transparent_62%)]"
        aria-hidden
      />
      <PageContainer className="relative z-[3]">
        <FadeIn className="mx-auto max-w-[640px] text-center">
          <h2 className="mb-5 font-bebas font-bold text-ggg-contact uppercase text-ggg-text [font-synthesis:weight_style]">
            <SplitText text={lead} />
            {accent ? (
              <>
                <br />
                <SplitText text={accent} startDelay={150} className="text-ggg-accent" />
              </>
            ) : null}
          </h2>
          <p className="mx-auto mb-10 max-w-[440px] text-[15px] font-normal leading-[1.6] text-ggg-muted">
            {contactCta.body}
          </p>
          <Button as={Link} href={contactCta.href} variant="primary">
            {contactCta.ctaLabel}
          </Button>
        </FadeIn>
      </PageContainer>
    </section>
  );
}
