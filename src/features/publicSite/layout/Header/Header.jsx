import Link from "next/link";

import { getSiteSettings } from "@/lib/cms/studio.js";
import BrandLogo from "../../shared/BrandLogo/BrandLogo.jsx";
import Button from "../../ui/Button.jsx";
import HeaderMobileMenu from "./HeaderMobileMenu.jsx";
import HeaderNavLinks from "./HeaderNavLinks.jsx";
import HeaderShell from "./HeaderShell.jsx";

const Header = async () => {
  const { navigation, studioName, logoUrl: logoSrc } = await getSiteSettings();

  return (
    <HeaderShell ariaLabel="Primary navigation">
      <Link
        className="inline-flex shrink-0 items-center gap-[9px] justify-self-start text-ggg-text no-underline touch-manipulation"
        href="/"
        aria-label={`${studioName} home`}
      >
        <BrandLogo src={logoSrc} variant="nav" alt={`${studioName} logo`} />
        <span className="whitespace-nowrap font-bebas text-base font-normal uppercase leading-none tracking-[0.1em] [font-synthesis:none] sm:text-lg lg:text-xl">
          {studioName}
        </span>
      </Link>

      <div className="hidden shrink-0 items-center gap-5 justify-self-center min-[1100px]:flex lg:gap-8">
        <HeaderNavLinks items={navigation} />
      </div>

      <div className="flex items-center justify-end gap-3 justify-self-end">
        <Button as={Link} href="/contact" variant="pill" className="hidden sm:inline-flex">
          Contact
        </Button>
        <HeaderMobileMenu items={navigation} />
      </div>
    </HeaderShell>
  );
};

export default Header;
