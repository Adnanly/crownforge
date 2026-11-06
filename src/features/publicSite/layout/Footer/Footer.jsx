"use client";

import Link from "next/link";
import { FaLinkedinIn } from "react-icons/fa";
import { SiDiscord, SiFacebook, SiGithub, SiInstagram, SiX, SiYoutube } from "react-icons/si";

import BrandLogo from "../../shared/BrandLogo/BrandLogo.jsx";
import PageContainer from "../../ui/PageContainer.jsx";

const SOCIAL_ICONS = {
  discord: SiDiscord,
  facebook: SiFacebook,
  instagram: SiInstagram,
  youtube: SiYoutube,
  x: SiX,
  github: SiGithub,
  linkedin: FaLinkedinIn,
};

const iconButtonClass =
  "inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-ggg-panel-strong text-ggg-text transition-colors hover:bg-ggg-accent hover:text-[#0a0a0a]";

const navLinkClass =
  "font-mono text-[12px] font-bold uppercase tracking-[0.22em] text-ggg-text transition-colors hover:text-ggg-accent";

const Footer = ({ studioName, logoSrc, links = [], navigation = [], extraNavigation = [], website }) => {
  const year = new Date().getFullYear();
  const host = (() => {
    try {
      return new URL(website).host;
    } catch {
      return "crownforge.in";
    }
  })();
  const navItems = [...navigation, ...extraNavigation];

  return (
    <PageContainer as="footer" className="border-t border-ggg-border pb-20 pt-12 text-center">
      {links.length > 0 ? (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {links.map((link) => {
            const Icon = SOCIAL_ICONS[link.id];
            if (!Icon) return null;
            return (
              <a
                key={link.id}
                aria-label={link.label}
                className={iconButtonClass}
                href={link.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Icon className="h-[17px] w-[17px]" />
              </a>
            );
          })}
        </div>
      ) : null}

      <Link className="mt-12 inline-flex items-center gap-3 text-ggg-text no-underline" href="/">
        <BrandLogo src={logoSrc} variant="footer" alt={`${studioName} logo`} />
        <span className="font-bebas text-2xl font-normal uppercase leading-none tracking-[0.12em] [font-synthesis:none]">
          {studioName}
        </span>
      </Link>

      <p className="mx-auto mt-4 max-w-[560px] text-ggg-body-xs leading-[1.7] text-ggg-muted">
        © {year} {studioName}. {host}
      </p>

      <nav className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-3" aria-label="Footer">
        {navItems.map((item) => (
          <Link className={navLinkClass} key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </PageContainer>
  );
};

export default Footer;
