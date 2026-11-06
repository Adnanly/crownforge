export type NavItem = {
  label: string;
  href: string;
};

export type CrownForgeSeo = {
  title: string;
  description: string;
  ogImage?: string;
};

export type InnerPageCopy = {
  titleLead: string;
  titleAccent: string;
  body: string;
  backLabel: string;
  description: string;
};

export type CrownForgeConfig = {
  studioName: string;
  tagline: string;
  description: string;
  website: string;
  /** Leave empty to hide public email. */
  contactEmail: string;
  branding: {
    /** Public path, e.g. /crownforge/branding/logo/logo.png. Leave empty until the real logo is added. */
    logo: string;
    heroImage: string;
  };
  /** Accent values live in src/app/globals.css (--ggg-accent). Change them there, not in components. */
  theme: {
    accentCssVariable: string;
    backgroundCssVariable: string;
  };
  navigation: NavItem[];
  seo: CrownForgeSeo;
  pages: {
    games: InnerPageCopy;
    news: InnerPageCopy;
    development: InnerPageCopy;
    characters: InnerPageCopy;
    objects: InnerPageCopy;
    contact: InnerPageCopy;
  };
  hero: {
    titleLines: string[];
    body: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
  };
  studioIntro: {
    eyebrow: string;
    title: string;
    body: string;
  };
  featuredGames: {
    heading: string;
    viewAllLabel: string;
  };
  homeDevelopment: {
    eyebrow: string;
    title: string;
    body: string;
    ctaLabel: string;
    href: string;
  };
  homeNews: {
    eyebrow: string;
    title: string;
    body: string;
    ctaLabel: string;
    href: string;
  };
  contactCta: {
    titleLines: string[];
    body: string;
    ctaLabel: string;
    href: string;
  };
  contactPage: {
    titleLines: string[];
    body: string;
    categories: string[];
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    submitLabel: string;
    subjectPrefix: string;
    replyPrefix: string;
    categoryPrefix: string;
  };
  emptyStates: {
    news: string;
    development: string;
    games: string;
    characters: string;
    objects: string;
  };
};

export const crownforgeConfig: CrownForgeConfig = {
  studioName: "CrownForge Studio",
  tagline: "Building worlds worth playing.",
  description:
    "CrownForge Studio is a game development studio. This site showcases our games and development progress.",
  website: "https://crownforge.in",
  // Already present in this project. Clear the string to hide email on the public site.
  contactEmail: "contact@crownforge.in",
  branding: {
    logo: "",
    heroImage: "",
  },
  theme: {
    accentCssVariable: "--ggg-accent",
    backgroundCssVariable: "--ggg-bg",
  },
  navigation: [
    { label: "Home", href: "/" },
    { label: "Games", href: "/games" },
    { label: "News", href: "/news" },
    { label: "Development Updates", href: "/development" },
    { label: "Contact", href: "/contact" },
  ],
  seo: {
    title: "CrownForge Studio",
    description:
      "CrownForge Studio is a game development studio. Explore our games, news, and development updates.",
  },
  pages: {
    games: {
      titleLead: "All",
      titleAccent: "Games",
      body: "Titles in development and on the way from CrownForge Studio.",
      backLabel: "Back to home",
      description: "Browse games from CrownForge Studio.",
    },
    news: {
      titleLead: "Studio",
      titleAccent: "News",
      body: "Official announcements and milestones from CrownForge Studio.",
      backLabel: "Back to home",
      description: "Official news from CrownForge Studio.",
    },
    development: {
      titleLead: "Development",
      titleAccent: "Updates",
      body: "Progress from the making of our games: systems, art, animation, and more.",
      backLabel: "Back to home",
      description: "Development progress from CrownForge Studio.",
    },
    characters: {
      titleLead: "Our",
      titleAccent: "Characters",
      body: "The characters of the worlds we are building at CrownForge Studio.",
      backLabel: "Back to home",
      description: "Characters from CrownForge Studio games.",
    },
    objects: {
      titleLead: "Objects",
      titleAccent: "& Assets",
      body: "Props, vehicles, buildings and other pieces of our game worlds.",
      backLabel: "Back to home",
      description: "Objects and assets from CrownForge Studio games.",
    },
    contact: {
      titleLead: "Contact",
      titleAccent: "CrownForge",
      body: "For general questions, business, collaboration, or press — send a message and we will follow up.",
      backLabel: "Back to home",
      description: "Get in touch with CrownForge Studio.",
    },
  },
  hero: {
    titleLines: ["CrownForge", "Studio"],
    body: "A game development studio building original worlds. Follow the games in progress and the work behind them.",
    primaryCtaLabel: "Explore Games",
    primaryCtaHref: "/games",
    secondaryCtaLabel: "",
    secondaryCtaHref: "",
  },
  studioIntro: {
    eyebrow: "The studio",
    title: "Games, in development",
    body: "CrownForge Studio is a game development studio. We focus on original titles and share progress here as work moves forward.",
  },
  featuredGames: {
    heading: "Featured Games",
    viewAllLabel: "View All Games",
  },
  homeDevelopment: {
    eyebrow: "Studio progress",
    title: "Development Updates",
    body: "Behind-the-scenes progress: systems, art, animation, and the work of making games.",
    ctaLabel: "View Development Updates",
    href: "/development",
  },
  homeNews: {
    eyebrow: "Studio news",
    title: "Latest News",
    body: "Official announcements and milestones from CrownForge Studio.",
    ctaLabel: "Read News",
    href: "/news",
  },
  contactCta: {
    titleLines: ["Get in", "touch"],
    body: "Have a project, collaboration, or question? Get in touch with CrownForge Studio.",
    ctaLabel: "Contact CrownForge",
    href: "/contact",
  },
  contactPage: {
    titleLines: ["Contact", "CrownForge"],
    body: "For general questions, business, collaboration, or press — send a message and we will follow up.",
    categories: ["General", "Business", "Collaboration", "Press"],
    namePlaceholder: "Your name",
    emailPlaceholder: "you@email.com",
    messagePlaceholder: "What would you like to talk about?",
    submitLabel: "Send Message",
    subjectPrefix: "CrownForge inquiry from ",
    replyPrefix: "Reply to:",
    categoryPrefix: "Category:",
  },
  emptyStates: {
    news: "No news yet. Official announcements will appear here.",
    development: "No development updates yet. Progress posts will appear here.",
    games: "No games to show right now. Check back soon.",
    characters: "No characters have been published yet.",
    objects: "No objects have been published yet.",
  },
};

export const FEATURED_GAMES_LIMIT = 3;
