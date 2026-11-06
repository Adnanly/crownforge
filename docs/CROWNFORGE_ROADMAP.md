# CrownForge Studio — Project Roadmap

Living document. Update after meaningful work. Describes the **actual repository state**.

## 1. Project Overview

CrownForge Studio is a game development studio. This repository is the public website plus Payload CMS admin.

**Purpose:** Present the studio, games, team, news, and development progress to an English-speaking audience (India primary).

**Stack:** Next.js 16.2.3, React 19, Payload CMS 3.84.1, PostgreSQL (Supabase), Tailwind CSS. Public UI lives under `src/features/publicSite/`. Scripts use npm or pnpm.

## 2. Current Stage

```text
Current Stage: Stage 2
```

Stage 2 adapts the existing visual system into the CrownForge Studio site: routes, config-driven games/team, Payload news/devlogs, no Media page, yellow/black identity — without a from-scratch redesign.

## 3. Completed Work

- [x] Stage 1 rebrand (studio name in chrome, CrownForge package identity)
- [x] PostgreSQL/Supabase connection (do not change `DATABASE_URL`)
- [x] Local development (`next dev` on :3000)
- [x] Payload admin + existing legacy runtime collections preserved (`/admin` returns 200)
- [x] Stage 2 website structure (Home, Games, Team, News, Development, Contact) — routes render 200 in `next start`
- [x] Dynamic game pages via `/games/[slug]` (4 games prerendered; unknown slug -> 404)
- [x] Config-driven games, team, social, studio settings
- [x] Payload `news` and `development-updates` collections + `/news/[slug]`, `/development/[slug]`
- [x] No public Media page or Media nav item (`/media` -> 404)
- [x] Dark yellow / orange-yellow accent via CSS variables (`--ggg-*`)
- [x] Production build passes (`npm run build`)
- [x] Build blockers fixed (see Change Log)
- [x] OG image uses CrownForge config + yellow accent (no legacy-site copy)
- [x] `sitemap.xml` covers all static routes, every config game, and published CMS posts
- [x] `llms.txt` rewritten for CrownForge (no legacy/Media copy)
- [x] Config validation: unique game slugs + required titles (`validate.config.ts`)
- [ ] Visual / responsive check in a real browser (not done yet)
## 4. Current Work

```text
Currently Working On:
```

Stage 2 is functionally complete and builds. Remaining Stage 2 item: visual + mobile browser review (nothing automated checks layout). Legacy unused inherited sections are still on disk (see Known Issues).

## Change Log (latest pass)

- Fixed build break: `SiLinkedin` no longer exists in `react-icons/si`; Footer + TeamMemberCard now use `FaLinkedinIn` from `react-icons/fa` (already installed, no new dependency).
- Fixed broken relative imports in `layout/PublicPageShell.jsx` and `sections/news/NewsCard.jsx`.
- Rewrote `src/app/(public)/opengraph-image.jsx` to read `crownforgeConfig` (was reading legacy contract content with red accent and fake-looking stats). Optional art: set `seo.ogImage` or `branding.heroImage` to a local `/public` path.
- Rewrote `src/app/sitemap.js` (was only `/` and `/games`).
- Rewrote `src/lib/agent/llms.js`.
- Added slug-uniqueness/title validation to `src/config/validate.config.ts`.

## Change Log (soft UI + legacy-reference pass)

- **Typography:** display font swapped to Plus Jakarta Sans (weights 500-700) via `--font-display`; the `font-bebas` class name is kept as a legacy token. Headings now use weight 600 in natural case with slightly negative tracking. Body stays Inter. Tailwind `bold`/`extrabold`/`black` all map to 600. Display size tokens (`ggg-hero`, `ggg-section`, ...) and the few large inline heading sizes were scaled down to suit the wider face.
- **Shape:** radii raised (`ggg-sm` 8, `ggg` 14, `ggg-md` 18, `ggg-lg` 22). Buttons rounded, sentence case, lighter weight; header/contact pill is fully rounded; badges are pills. Borders lightened (`--ggg-border` 0.06, `--ggg-border-strong` 0.11); card shadows softened. Contact form fields use Inter instead of mono.
- **No changes** to layout, routes, components' structure, animations, CMS, collections or schema. Colour system unchanged.
- **Legacy references:** README rewritten for CrownForge; stale old-brand screenshot removed from `docs/images` (backed up outside the repo); legacy contract content (served at `/api/public/site-data`) stripped of inherited-platform copy and fabricated numbers; internal metrics-source label renamed.
- Retained on purpose (internal only, not public): `src/lib/runtime/*`, `src/scripts/seedGames.js`, `seedGroup.js`, `runtimeRefresh*.js`, legacy collections/admin group labels, `railway.cron.json`, legacy test files, `rbx`-style URL builders in `publicSiteData.js`, the `aboutGGG` API field name.
## 5. Next Tasks

1. Stage 3 — Publish real News and Development Updates in Payload (no fake posts in source).
2. Stage 4 — Drop in CrownForge logo, favicon, game hero/gallery art, team photos, social URLs.
3. Fill empty game fields (descriptions, trailers, genre, platforms, release) in `src/config/games.config.ts` when assets/copy exist.
4. Stage 5 — Production domain, OG image asset, deployment checks.

## 6. Future Stages

- **Stage 1** — Rebrand / foundation (done)
- **Stage 2** — CrownForge website structure (this stage)
- **Stage 3** — Content / CMS publishing
- **Stage 4** — Final branding / assets
- **Stage 5** — Production / deployment

Do not invent extra product features (store, careers, accounts, comments).

## 7. Architecture

- **App routes:** `src/app/(public)/` — `/`, `/games`, `/games/[slug]`, `/team`, `/news`, `/news/[slug]`, `/development`, `/development/[slug]`, `/contact`
- **Admin:** `src/app/(payload)/admin`
- **Config:** `src/config/crownforge.config.ts`, `games.config.ts`, `team.config.ts`, `social.config.ts`
- **Public UI:** `src/features/publicSite/` (Header, Footer, Hero, cards, animations)
- **CMS collections (keep):** Users, Games (legacy sync), Groups, MediaCards, SocialProfiles, MediaAssets, Runtime*
- **CMS collections (Stage 2):** `news`, `development-updates`
- **Globals:** SiteSettings, PublicSite (legacy JSON chrome; public nav is config-driven)
- **Assets:** `public/crownforge/` (placeholders until files are added)
- **DB:** `@payloadcms/db-postgres`, `push` enabled when `NODE_ENV !== production`

## 8. Important Decisions

- Preserve existing website UI DNA; do not redesign from scratch.
- Keep Tailwind tokens named `ggg-*` (technical); change values via CSS variables.
- Accent is dark yellow / orange-yellow, not neon `#FFD400`.
- No Media page, no Media navbar item, no `/media` route.
- Games are configuration-driven; featured = `featured: true` (show up to 3 on Home).
- News and Development Updates are Payload-driven; do not invent posts.
- Do not replace PostgreSQL or Payload.
- Do not invent game/team/social facts; empty optional fields stay hidden.
- The inherited metrics-sync backend (`src/lib/runtime`) stays; it is not the public CrownForge catalog.

## 9. Protected / Do Not Change

- `DATABASE_URL`, `PAYLOAD_SECRET`
- Supabase/PostgreSQL provider
- Payload authentication / `/admin`
- Existing legacy runtime collections, refresh scripts, and `/api/public/site-data` unless a later stage explicitly replaces them
- Do not commit secrets or edit `.env` credentials

## 10. Known Issues

- `npm run lint` fails on a circular `react` plugin reference in ESLint config (documented in `AGENTS.md`; pre-existing, not caused by app code). Not fixed — tooling change outside Stage 2 scope.
- Legacy inherited files remain on disk but are not used by any public CrownForge page: `sections/AboutGGG`, `Media`, `ProofBar`, `WorkTogether`, `GameCard/*`, `routes/games/GamesShell`, `content/publicSiteContractContent.js` (still feeds backend `/api/public/site-data` and the PublicSite global). Left intentionally; safe to remove in a later cleanup once confirmed unused. `publicSiteContractContent.js` (feeds the legacy `/api/public/site-data`) was cleaned in the soft-UI pass: legacy-brand copy and fabricated stats removed, nav now points at real routes.
- PublicSite global in the database may still hold old JSON; public pages read **config**, so it does not affect Stage 2 pages.
- `contactEmail` is set to `contact@crownforge.in` in `crownforge.config.ts` (noted there as pre-existing). Confirm this mailbox is real; clear the string to hide it.
- No `public/` directory exists yet, so there is no logo, favicon asset, hero art or OG art. Header falls back to the studio name; OG image renders text-only.
- `og:url`/sitemap use `NEXT_PUBLIC_SITE_URL` (localhost in `.env`). Set it to `https://crownforge.in` in production.
- Home "Featured Games" markup repeats the three games several times (existing showcase carousel behavior). Not yet reviewed visually.
## 11. Verification

- [x] `npm run build` — passes (Next 16.2.3, TypeScript clean)
- [ ] `npm run lint` — fails on pre-existing ESLint config error (see Known Issues)
- [x] `next start` (port 3100) — all routes below returned expected status
- [x] Routes: `/`, `/games`, `/games/{trek-bond,black-veil,war-x,kingdom-of-mayana}`, `/team`, `/news`, `/development`, `/contact`, `/admin`, `/api/health`, `/sitemap.xml`, `/robots.txt`, `/llms.txt`, OG image = 200; unknown game/news/dev slug and `/media` = 404
- [x] No legacy-brand copy / fake stats in rendered HTML of public pages, `llms.txt`
- [x] Page titles/OG/Twitter metadata say CrownForge Studio
- [x] Empty trailer renders no iframe (checked on `/games/trek-bond`)
- [ ] `npm run dev` interactive check
- [ ] Mobile / responsive checked in browser
- [ ] YouTube trailer with a real video ID
- [ ] Payload admin: create a News + Development post and confirm it appears
## 12. Configuration locations

| What | Where |
| --- | --- |
| Studio name, tagline, SEO, nav | `src/config/crownforge.config.ts` |
| Games, featured, trailers, galleries | `src/config/games.config.ts` |
| Team | `src/config/team.config.ts` |
| Social URLs | `src/config/social.config.ts` |
| Theme tokens | `src/app/globals.css` (`:root` `--ggg-*`) |
| News / devlogs | Payload admin collections |

## HANDOFF

Before continuing this project:

1. Read this roadmap.
2. Inspect the current repository state.
3. Check the Completed Work section.
4. Check Current Work.
5. Continue from Next Tasks.
6. Do not repeat completed work.
7. Do not undo existing architecture decisions unless there is a documented reason.
8. Update this roadmap after meaningful changes.
