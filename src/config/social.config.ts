export type SocialLinks = {
  discord?: string;
  instagram?: string;
  youtube?: string;
  x?: string;
  github?: string;
  linkedin?: string;
};

/** Only URLs that are set will render in the UI. Do not invent accounts. */
export const socialLinks: SocialLinks = {
  discord: "",
  instagram: "",
  youtube: "",
  x: "",
  github: "",
  linkedin: "",
};

export type SocialLinkItem = {
  id: keyof SocialLinks;
  label: string;
  href: string;
};

const SOCIAL_LABELS: Record<keyof SocialLinks, string> = {
  discord: "Discord",
  instagram: "Instagram",
  youtube: "YouTube",
  x: "X",
  github: "GitHub",
  linkedin: "LinkedIn",
};

export function getConfiguredSocialLinks(): SocialLinkItem[] {
  return (Object.keys(socialLinks) as (keyof SocialLinks)[])
    .map((id) => {
      const href = socialLinks[id]?.trim();
      if (!href) return null;
      return { id, label: SOCIAL_LABELS[id], href };
    })
    .filter((item): item is SocialLinkItem => item !== null);
}
