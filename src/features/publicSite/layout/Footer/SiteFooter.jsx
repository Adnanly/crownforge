import { getSiteSettings, getWorldNavigation } from "@/lib/cms/studio.js";
import Footer from "./Footer.jsx";

/** Server wrapper: loads Website Settings and passes plain props to the (client) footer. */
export default async function SiteFooter() {
  const [settings, extraNavigation] = await Promise.all([getSiteSettings(), getWorldNavigation()]);

  return (
    <Footer
      studioName={settings.studioName}
      logoSrc={settings.footerLogoUrl}
      links={settings.socialLinks}
      navigation={settings.navigation}
      extraNavigation={extraNavigation}
      website={settings.website}
    />
  );
}