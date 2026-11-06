export const GROUP_URL = "";

export const CONTACT_EMAIL = "contact@crownforge.in";

export const publicSiteContractContent = {
  shared: {
    missingValue: "-",
    zeroValue: "0",
  },
  site: {
    name: "CrownForge Studio",
    contactEmail: CONTACT_EMAIL,
    ctaLinks: {
      partnership: `mailto:${CONTACT_EMAIL}?subject=Partnership%20Inquiry`,
      acquisition: `mailto:${CONTACT_EMAIL}?subject=Game%20Acquisition`,
      general: `mailto:${CONTACT_EMAIL}`,
    },
  },
  nav: {
    ariaLabel: "Primary navigation",
    homeAriaLabel: "CrownForge Studio home",
    items: [
      { label: "Games", href: "/games" },
      { label: "News", href: "/news" },
      { label: "Contact", href: "/contact" },
    ],
    groupCtaLabel: "Community",
  },
  hero: {
    titleLines: ["CrownForge", "Studio"],
    body:
      "A game development studio building original worlds. Follow the games in progress and the work behind them.",
    primaryCtaLabel: "Explore Games",
    secondaryCtaLabel: "Talk to Us",
    secondaryCtaHref: "/contact",
  },
  ticker: {
    ariaLabel: "Studio highlights",
    items: [
      { text: "Original games in development", star: true },
      { text: "Development updates and news" },
    ],
  },
  stats: {
    ariaLabel: "Key studio metrics",
    fallbacks: {
      totalVisits: "-",
      totalMembers: "-",
      mediaViews: "-",
      activePlayers: "-",
    },
    cards: {
      totalVisits: {
        label: "Total Visits",
        sub: "Across all titles",
      },
      totalMembers: {
        label: "Group Members",
        sub: "Community",
      },
      mediaViews: {
        label: "Media Views",
        sub: "Across social channels",
      },
      activePlayers: {
        label: "Active Players",
        sub: "Playing right now",
      },
    },
  },
  catalog: {
    heading: "Top Titles",
    viewAllLabel: "View games",
    errorMessage:
      "Live game stats are temporarily unavailable. Showing the latest cached catalog when possible.",
  },
  social: {
    heading: "Media",
    previousAriaLabel: "Previous media case study",
    nextAriaLabel: "Next media case study",
    links: [],
    mediaCards: [
      {
        id: "viral-reach",
        name: "Social Media",
        eyebrow: "Social",
        headline: "FOLLOW",
        subLabel: "SOCIAL",
        description: "Follow CrownForge Studio for updates on our games and the work behind them.",
        descriptionMobile: "Follow CrownForge Studio for game updates.",
        ctaLabel: "SEE UPDATES",
        ctaHref: "/news",
        mediaType: "video",
        mediaAsset: "socialProof.viralReach",
        mediaAlt: "Video from CrownForge Studio.",
      },
      {
        id: "creator-partnerships",
        name: "Collaborations",
        eyebrow: "Partnerships",
        headline: "COLLABORATE",
        subLabel: "PARTNERSHIPS",
        description: "Interested in working with CrownForge Studio? Get in touch about collaboration and business inquiries.",
        descriptionMobile: "Interested in working with us? Get in touch.",
        ctaLabel: "GET IN TOUCH",
        ctaHref: "/contact",
        mediaType: "video",
        mediaAsset: "socialProof.creatorPartnerships",
        mediaAlt: "Collaboration video from CrownForge Studio.",
      },
      {
        id: "community-engagement",
        name: "Community",
        eyebrow: "Community",
        headline: "COMMUNITY",
        metricKey: "totalMembers",
        subLabel: "COMMUNITY",
        description: "Follow the studio and its games as they take shape.",
        descriptionMobile: "Follow the studio and its games.",
        ctaLabel: "VIEW GAMES",
        ctaHref: "/games",
        mediaType: "image",
        mediaAsset: "socialProof.communityPreview",
        mediaAlt: "CrownForge Studio community artwork.",
      },
    ],
  },
  studio: {
    titleLines: ["What We", "Do"],
    cards: [
      {
        id: "brands",
        title: "Collaboration",
        body: "Interested in working with CrownForge Studio? Get in touch about collaboration and business inquiries.",
        ctaLabel: "Get in touch",
        ctaHref: "/contact",
        mediaAsset: "services.brandIntegrations",
      },
      {
        id: "studio",
        title: "Original Games",
        body: "We focus on original titles and share progress as the work moves forward.",
        ctaLabel: "View games",
        ctaHref: "/games",
        mediaAsset: "services.originalGames",
      },
      {
        id: "publishing",
        title: "Press & Media",
        body: "For press and media questions, send us a message and we will follow up.",
        ctaLabel: "Contact us",
        ctaHref: "/contact",
        mediaAsset: "services.publishingAcquisitions",
        mediaPosition: "left",
      },
    ],
  },
  contact: {
    titleLines: ["Let's", "Work Together"],
    body: "For general questions, business, collaboration, or press, send a message and we will follow up.",
    namePlaceholder: "Jane Carver",
    emailPlaceholder: "jane@studio.gg",
    messagePlaceholder: "Tell us what you are working on and what you need.",
    submitLabel: "Send Message",
    subjectPrefix: "CrownForge inquiry from ",
    replyPrefix: "Reply to:",
  },
  footer: {
    studioHeading: "Studio",
    followHeading: "Follow",
    links: {
      games: "Games",
      about: "Studio",
      contactSection: "Contact",
      email: "Email",
      group: "Community",
    },
    copyrightTemplate: "All rights reserved.",
  },
  gameCard: {
    artworkPlaceholderSuffix: "artwork",
    playingUnitLabel: "playing",
    visitsUnitLabel: "visits",
  },
  gamesPage: {
    backLabel: "Back to home",
    titleLead: "All",
    titleAccent: "Games",
    emptyMessage: "No games to show right now. Check back soon.",
    moreCard: {
      countPrefix: "+",
      label: "more games",
      visitsUnitLabel: "combined visits",
    },
  },
};

export function clonePublicSiteContractContent() {
  return JSON.parse(JSON.stringify(publicSiteContractContent));
}
