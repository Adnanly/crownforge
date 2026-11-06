import Header from "../../layout/Header/Header.jsx";
import SiteFooter from "../../layout/Footer/SiteFooter.jsx";
import ContactCta from "../../sections/ContactCta/ContactCta.jsx";
import FeaturedGames from "../../sections/FeaturedGames/FeaturedGames.jsx";
import Hero from "../../sections/Hero/Hero.jsx";
import StudioIntro from "../../sections/StudioIntro/StudioIntro.jsx";
import FadeIn from "../../shared/FadeIn/FadeIn.jsx";
import { getSiteSettings } from "@/lib/cms/studio.js";

const dividerClass = "h-px w-full bg-ggg-border";

const HomeShell = async ({ children }) => {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen isolate overflow-x-hidden bg-ggg-bg text-ggg-text font-medium">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-ggg focus:top-3 focus:z-[300] focus:bg-ggg-accent focus:px-4 focus:py-2 focus:text-[#0a0a0a]"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content">
        <Hero hero={settings.hero} heroKeyArtUrl={settings.heroImageUrl} />
        <FadeIn>
          <StudioIntro />
        </FadeIn>
        <div className={dividerClass} role="presentation" aria-hidden />
        <FadeIn>
          <FeaturedGames />
        </FadeIn>
        <div className={dividerClass} role="presentation" aria-hidden />
        {children}
        <div className={dividerClass} role="presentation" aria-hidden />
        <FadeIn>
          <ContactCta />
        </FadeIn>
      </main>
      <SiteFooter />
    </div>
  );
};

export default HomeShell;